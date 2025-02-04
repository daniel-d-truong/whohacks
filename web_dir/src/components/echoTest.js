import React, { Component } from 'react';
import MetaTags from 'react-meta-tags';
import 'bootstrap/dist/css/bootstrap.css';
import './echoTest.css';

class EchoTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        // this.controlRemoteAudio = this.controlRemoteAudio.bind(this);
        // this.controlLocalAudio = this.controlLocalAudio.bind(this);
        // this.controlLocalVideo = this.controlLocalVideo.bind(this);
        // this.controlRemoteVideo = this.controlRemoteVideo.bind(this);
    };

    render () {
        const localVideo = document.getElementById("local-video");
        const remoteVideo = document.getElementById("remote-video");
        const localData = document.getElementById("local-data");
        const remoteData = document.getElementById("remote-data");
        const sizeTag = document.getElementById("size-tag");
        const brTag = document.getElementById("br-tag");
        let simulcast = false;
        let localDataChannel;

        remoteVideo.addEventListener("loadedmetadata", function () {
            sizeTag.innerHTML = `${remoteVideo.videoWidth}x${remoteVideo.videoHeight}`;
        });

        remoteVideo.onresize = function () {
            sizeTag.innerHTML = `${remoteVideo.videoWidth}x${remoteVideo.videoHeight}`;
        };

        /* eslint-env browser */
        const joinBtns = document.getElementById("start-btns");

        const getQueryVariable = (key) => {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    if(pair[0] == key){return pair[1];}
            }
            return(false);
        };

        const sid = getQueryVariable("sid") || "room1";
        const uid = getQueryVariable("uid") || uuidv4();

        const signalLocal = new IonSDK.IonSFUJSONRPCSignal(
            //"ws://localhost:8443/ws?uid=tony&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0b255IiwicmlkIjoicm9vbTEifQ.mopgibW3OYONYwzlo-YvkDIkNoYJc3OBQRsqQHZMnD8"
            "ws://localhost:8443/ws?uid=" + uuidv4()
        );
        const signalRemote = new IonSDK.IonSFUJSONRPCSignal(
            "ws://localhost:8443/ws?uid=" + uuidv4()
        );

        const clientLocal = new IonSDK.Client(signalLocal);
        const clientRemote = new IonSDK.Client(signalRemote);

        let localStream;
        const start = (sc) => {
            clientLocal.join(sid);
            clientRemote.join(sid);
            simulcast = sc;
            IonSDK.LocalStream.getUserMedia({
                resolution: "hd",
                simulcast: sc,
                audio: true,
            })
                .then((media) => {
                    localStream = media;
                    localVideo.srcObject = media;
                    localVideo.autoplay = true;
                    localVideo.controls = true;
                    localVideo.muted = true;
                    joinBtns.style.display = "none";
                    clientLocal.publish(media);
                })
                .catch(console.error);
            localDataChannel = clientLocal.createDataChannel("data");
        };

        const send = () => {
            if (localDataChannel.readyState === "open") {
                localDataChannel.send(localData.value);
            }
        };

        let remoteStream;
        clientRemote.ontrack = (track, stream) => {
            if (track.kind === "video") {
                remoteStream = stream;
                remoteVideo.srcObject = stream;
                remoteVideo.autoplay = true;

                getStats();

                document
                .querySelectorAll(".controls")
                .forEach((el) => (el.style.display = "block"));
                if (simulcast) {
                    document.getElementById("simulcast-controls").style.display =
                    "block";
                } else {
                    document.getElementById("simple-controls").style.display = "block";
                }
            }
        };

        clientRemote.ondatachannel = ({ channel }) => {
            channel.onmessage = ({ data }) => {
                remoteData.innerHTML = data;
            };
        };

        const api = {
            streamId: "",
            video: "high",
            audio: true,
        };

        function controlRemoteVideo = (radio) => {
            remoteStream.preferLayer(radio.value);
        
            // update ui
            api.streamId = remoteStream.id;
            api.video = radio.value;
            const str = JSON.stringify(api, null, 2);
            document.getElementById("api").innerHTML = syntaxHighlight(str);
        };
        
        function controlRemoteAudio = (radio) => {
            if (radio.value === "true") {
                remoteStream.mute("audio");
            } else {
                remoteStream.unmute("audio");
            }
        
            // update ui
            api.streamId = remoteStream.id;
            api.audio = radio.value === "true";
            const str = JSON.stringify(api, null, 2);
            document.getElementById("api").innerHTML = syntaxHighlight(str);
        };
        
        function controlLocalVideo = (radio) => {
            if (radio.value === "false") {
                localStream.mute("video");
            } else {
                localStream.unmute("video");
            }
        };
        
        function controlLocalAudio = (radio){
            if (radio.value === "false") {
                localStream.mute("audio");
            } else {
                localStream.unmute("audio");
            }
        };
        
        function syntaxHighlight(json) {
            json = json
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            
            return json.replace(
                /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
                function (match) {
                let cls = "number";
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                    cls = "key";
                    } else {
                    cls = "string";
                    }
                } else if (/true|false/.test(match)) {
                    cls = "boolean";
                } else if (/null/.test(match)) {
                    cls = "null";
                }
                return '<span class="' + cls + '">' + match + "</span>";
                }
            );
        };
        
        getStats = () => {
            let bytesPrev;
            let timestampPrev;
            setInterval(() => {
                clientRemote.getSubStats(null).then((results) => {
                results.forEach((report) => {
                    const now = report.timestamp;
        
                    let bitrate;
                    if (
                    report.type === "inbound-rtp" &&
                    report.mediaType === "video"
                    ) {
                    const bytes = report.bytesReceived;
                    if (timestampPrev) {
                        bitrate = (8 * (bytes - bytesPrev)) / (now - timestampPrev);
                        bitrate = Math.floor(bitrate);
                    }
                    bytesPrev = bytes;
                    timestampPrev = now;
                    }
                    if (bitrate) {
                    brTag.innerHTML = `${bitrate} kbps`;
                    }
                });
                });
            }, 1000);
        };

        return (
            <div>
                <MetaTags>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
                </MetaTags>
                <title>Pion ion | EchoTest</title>

                <nav class="navbar navbar-light bg-light border-bottom">
                    <h3>Pion</h3>
                </nav>
                <div class="container pt-4">
                <div class="row" id="start-btns">
                    <div class="col-12">
                    <button type="button" class="btn btn-primary" onclick="start(false)">
                        start
                    </button>
                    <button type="button" class="btn btn-primary" onclick="start(true)">
                        start with simulcast
                    </button>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12 pt-4">Media</div>
                </div>
                <div class="row">
                    <div class="col-6 pt-2">
                        <span
                            style="position: absolute; margin-left: 5px; margin-top: 5px"
                            class="badge badge-primary"
                            >Local</span>
                        <video
                            id="local-video"
                            style="background-color: black"
                            width="320"
                            height="240"
                        ></video>
                    <div class="controls" style="display: none">
                        <div class="row pt-3">
                            <div class="col-3">
                                <strong>Video</strong>
                                <div class="radio">
                                <label>
                                    <input
                                        type="radio"
                                        onclick="controlLocalVideo(this)"
                                        value="true"
                                        name="optlocalvideo"
                                        checked
                                    />
                                    Unmute</label>
                            </div>
                            <div class="radio">
                            <label>
                                <input
                                    type="radio"
                                    onclick="controlLocalVideo(this)"
                                    value="false"
                                    name="optlocalvideo"
                                />
                                Mute</label>
                            </div>
                        </div>
                        <div class="col-3">
                            <strong>Audio</strong>
                            <div class="radio">
                            <label>
                                <input
                                    type="radio"
                                    onclick="controlLocalAudio(this)"
                                    value="true"
                                    name="optlocalaudio"
                                    checked
                                />
                                Unmute</label>
                            </div>
                            <div class="radio">
                            <label>
                                <input
                                    type="radio"
                                    onclick="controlLocalAudio(this)"
                                    value="false"
                                    name="optlocalaudio"
                                />
                                Mute</label>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="col-6 pt-2">
                    <span
                        style="position: absolute; margin-left: 5px; margin-top: 5px"
                        class="badge badge-primary"
                        >Remote</span>
                    <span
                        id="size-tag"
                        style="position: absolute; margin-left: 5px; top: 225px"
                        class="badge badge-primary"
                    ></span>
                    <span
                        id="br-tag"
                        style="position: absolute; left: 270px; top: 225px"
                        class="badge badge-primary"
                    ></span>
                    <video
                        id="remote-video"
                        style="background-color: black"
                        width="320"
                        height="240"
                    ></video>
                    <div class="controls" style="display: none">
                        <div class="row pt-3">
                        <div class="col-3">
                            <strong>Video</strong>
                            <div id="simulcast-controls" style="display: none">
                            <div class="radio">
                                <label>
                                    <input
                                        type="radio"
                                        onclick="controlRemoteVideo(this)"
                                        value="high"
                                        name="optremotevideos"
                                    />
                                High</label>
                            </div>
                            <div class="radio">
                                <label>
                                    <input
                                        type="radio"
                                        onclick="controlRemoteVideo(this)"
                                        value="medium"
                                        name="optremotevideos"
                                    />
                                Medium</label>
                            </div>
                            <div class="radio">
                                <label>
                                    <input
                                        type="radio"
                                        onclick="controlRemoteVideo(this)"
                                        value="low"
                                        name="optremotevideos"
                                    />
                                Low</label>
                            </div>
                            <div class="radio">
                                <label>
                                    <input
                                        type="radio"
                                        onclick="controlRemoteVideo(this)"
                                        value="none"
                                        name="optremotevideos"
                                    />
                                Mute</label>
                            </div>
                            </div>

                            <div id="simple-controls" style="display: none">
                            <div class="radio">
                                <label>
                                    <input
                                        type="radio"
                                        onclick="controlRemoteVideo(this)"
                                        value="high"
                                        name="optremotevideo"
                                        checked
                                    />
                                Unmute</label>
                            </div>
                            <div class="radio">
                                <label>
                                    <input
                                        type="radio"
                                        onclick="controlRemoteVideo(this)"
                                        value="none"
                                        name="optremotevideo"
                                    />
                                Mute</label>
                            </div>
                            </div>
                        </div>
                        <div class="col-3">
                            <strong>Audio</strong>
                            <div class="radio">
                            <label>
                                <input
                                    type="radio"
                                    onclick="controlRemoteAudio(this)"
                                    value="true"
                                    name="optremoteaudio"
                                    checked
                                />
                                Unmute</label>
                            </div>
                            <div class="radio">
                            <label
                                ><input
                                type="radio"
                                onclick="controlRemoteAudio(this)"
                                value="false"
                                name="optremoteaudio"
                                />
                                Mute</label
                            >
                            </div>
                        </div>
                        </div>
                        <strong class="d-block">API call</strong>
                        <pre
                        id="api"
                        class="d-block border"
                        style="
                            background-color: #f8f9fa;
                            height: 117px;
                            width: 320px;
                            margin: 5px 0;
                        "
                        ></pre>
                    </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 pt-4">Data</div>
                </div>
                <div class="row">
                    <div class="col-6 pt-2">
                    <textarea
                        id="local-data"
                        class="d-block border"
                        style="
                        background-color: #f8f9fa;
                        height: 117px;
                        width: 320px;
                        margin: 5px 0;
                        padding: 5px;
                        "
                        placeholder="Send a message"
                    ></textarea>
                    <button type="button" class="btn btn-primary" onclick="send()">
                        send
                    </button>
                    </div>
                    <div class="col-6 pt-2">
                    <pre
                        id="remote-data"
                        class="d-block border"
                        style="
                        background-color: #f8f9fa;
                        height: 117px;
                        width: 320px;
                        margin: 5px 0;
                        "
                    ></pre>
                    </div>
                </div>
                </div>   
                <script
                src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"
                integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN"
                crossorigin="anonymous"
                ></script> 
                <script
                src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"
                integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV"
                crossorigin="anonymous"
                ></script>
                <script src="https://cdn.jsdelivr.net/npm/uuid@latest/dist/umd/uuidv4.min.js"></script>
                <script src="https://unpkg.com/ion-sdk-js@1.5.3/dist/ion-sdk.min.js"></script>
            </div>
        );
    }
}

export default EchoTest;