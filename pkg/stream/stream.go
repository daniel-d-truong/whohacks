package stream

import (
	"bytes"
	"context"
	"fmt"
	"io"

	speech "cloud.google.com/go/speech/apiv1"
	logger "github.com/pion/ion-log"
	sdk "github.com/pion/ion-sdk-go"
	speechpb "google.golang.org/genproto/googleapis/cloud/speech/v1"

	"log"
	"strings"

	"github.com/pion/webrtc/v3"
	"github.com/pion/webrtc/v3/pkg/media/oggwriter"
)

func onTrack(track *webrtc.TrackRemote, receiver *webrtc.RTPReceiver) {
	codec := track.Codec()
	logger.Infof("calling onTrack with codec: %s", codec.MimeType)

	audioStream := make(chan []byte)

	opusDecoder, err := newDecoder()
	if err != nil {
		panic(err)
	}

	if strings.EqualFold(codec.MimeType, webrtc.MimeTypeOpus) {
		logger.Infof("Got Opus track")

		var buf bytes.Buffer
		audioWriter, err := oggwriter.NewWith(&buf, 16000, 1)
		if err != nil {
			audioWriter.Close()
		}

		go speechToText(audioStream)

		// timer := time.NewTicker(time.Second)

		for {
			// n, _, err := track.Read(buf)

			rtpPacket, _, err := track.ReadRTP()
			if err != nil {
				panic(err)
			}

			audioChunkChan := decode(opusDecoder, rtpPacket.Payload)
			audioChunk := <-audioChunkChan

			audioStream <- audioChunk

			// rtpPacket, _, err := track.ReadRTP()
			// if err != nil {
			// 	panic(err)
			// }
			// if err := audioWriter.WriteRTP(rtpPacket); err != nil {
			// 	panic(err)
			// }

			// // // only read if we get to 1024 bytes?
			// // if buf.Len() > 1024 {
			// n, err := buf.Read(filledBuffer)
			// if err != nil {
			// 	panic(err)
			// }

			// audioStream <- filledBuffer[:n]
			// }

		}
	}

}

func decode(decoder *opusDecoder, audioChunk []byte) chan []byte {
	decodeBool := make(chan []byte)
	go func() {
		decodedChunk, err := decoder.decode(audioChunk)
		if err != nil {
			logger.Errorf("error received: %s", err.Error())
			decodeBool <- []byte{}
		}
		decodeBool <- decodedChunk
	}()

	return decodeBool
}

func speechToText(bytesChan <-chan []byte) {
	logger.Infof("calling speechToText")
	ctx := context.Background()

	client, err := speech.NewClient(ctx)
	if err != nil {
		log.Fatal(err)
	}
	stream, err := client.StreamingRecognize(ctx)
	if err != nil {
		log.Fatal(err)
	}
	// Send the initial configuration message.
	if err := stream.Send(&speechpb.StreamingRecognizeRequest{
		StreamingRequest: &speechpb.StreamingRecognizeRequest_StreamingConfig{
			StreamingConfig: &speechpb.StreamingRecognitionConfig{
				Config: &speechpb.RecognitionConfig{
					Encoding:          speechpb.RecognitionConfig_LINEAR16,
					SampleRateHertz:   16000,
					LanguageCode:      "en-US",
					AudioChannelCount: 1, // EnableSeparateRecognitionPerChannel: true,
				},
			},
		},
	}); err != nil {
		log.Fatal(err)
	}

	// // throw away request
	// stream.Send(&speechpb.StreamingRecognizeRequest{
	// 	StreamingRequest: &speechpb.StreamingRecognizeRequest_AudioContent{
	// 		AudioContent: []byte("abcdef"),
	// 	},
	// })

	go func() {
		// Pipe stdin to the API.
		// buf := make([]byte, 1024)
		for {
			// n, err := bytesBuffer.Read(buf)
			buf := <-bytesChan
			logger.Infof("number of bytes sent: %d", len(buf))
			if len(buf) > 0 {
				if err := stream.Send(&speechpb.StreamingRecognizeRequest{
					StreamingRequest: &speechpb.StreamingRecognizeRequest_AudioContent{
						AudioContent: buf,
					},
				}); err != nil {
					log.Printf("Could not send audio: %v", err)
				}
			}
			if len(buf) == 0 {
				// Nothing else to pipe, close the stream.
				if err := stream.CloseSend(); err != nil {
					log.Fatalf("Could not close stream: %v", err)
				}
				return
			}
			if err != nil {
				log.Printf("Could not read from stdin: %v", err)
				continue
			}
		}
	}()

	logger.Infof("started running goroutine")

	for {
		logger.Infof("expecting received stream")
		resp, err := stream.Recv()
		logger.Infof("response: %s", resp.String())
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatalf("Cannot stream results: %v", err)
		}
		if err := resp.Error; err != nil {
			// Workaround while the API doesn't give a more informative error.
			if err.Code == 3 || err.Code == 11 {
				log.Print("WARNING: Speech recognition request exceeded limit of 60 seconds.")
			}
			log.Fatalf("Could not recognize: %v", err)
		}
		for _, result := range resp.Results {
			fmt.Printf("Result: %+v\n", result)
		}
	}
}

func CreateClient(addr string, session string) {
	// add stun servers
	webrtcCfg := webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			webrtc.ICEServer{
				URLs: []string{"stun:stun.stunprotocol.org:3478", "stun:stun.l.google.com:19302"},
			},
		},
	}

	config := sdk.Config{
		Log: logger.Config{
			Level: "debug",
		},
		WebRTC: sdk.WebRTCTransportConfig{
			Configuration: webrtcCfg,
		},
	}

	// new sdk engine
	e := sdk.NewEngine(config)

	// get a client from engine
	c := e.AddClient(addr, session, "client id")

	c.OnTrack = onTrack

	// client join a session
	err := c.Join(session)

	// publish file to session if needed
	if err != nil {
		fmt.Println(err.Error())
		panic(err)
	}
	select {}
}
