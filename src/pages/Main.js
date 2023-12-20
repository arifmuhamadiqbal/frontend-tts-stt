import React, { useState } from "react";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faMicrophone,
  faStop,
  faTrash,
  faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";

const Main = () => {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en");
  const [audioUrl, setAudioUrl] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const [textToCopy, setTextToCopy] = useState();
  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000,
  });

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: "Id" });
    setIsRecording(true);
  };

  const { transcript, resetTranscript } = useSpeechRecognition();

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleConvert = async () => {
    setAudioUrl("");

    try {
      const response = await axios.post(
        "http://localhost:8000/tts",
        { text, language },
        { responseType: "blob" }
      );
      setAudioUrl(URL.createObjectURL(response.data));

      const audioElement = document.getElementById("audioPlayer");
      if (audioElement) {
        audioElement.play();
      }
    } catch (error) {
      console.error("Error converting text to speech:", error);
    }
  };

  const handleTrashClick = () => {
    resetTranscript();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
  };

  return (
    <Container>
      <Container className="mt-4 px-4 form-control">
        <Row className="mt-4">
          <h3 className="mb-4">✏️ Text To Speech</h3>
          <Col>
            <Form.Control
              as="textarea"
              value={text}
              onChange={handleTextChange}
              placeholder="Enter text"
            />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Form.Control
              as="select"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>
              <option value="id">Indonesian</option>
              {/* Tambahkan opsi bahasa jika diperlukan */}
            </Form.Control>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Button variant="primary" onClick={handleConvert}>
              <FontAwesomeIcon icon={faVolumeHigh} />
            </Button>
          </Col>
        </Row>
        <Row className="my-4">
          <Col>
            {audioUrl && (
              <div className="d-flex">
                <h4 className="pt-2">Result :</h4>
                <audio className="mx-4" id="audioPlayer" controls autoPlay>
                  <source src={audioUrl} type="audio/wav" />
                </audio>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      <Container className="form-control mt-4">
        <Row className="mt-4">
          <h3 className="mb-4">📢 Speech To Text</h3>
        </Row>
        <Container
          className="form-control px-4 py-4 mb-4"
          onClick={() => setTextToCopy(transcript)}
        >
          {transcript}
        </Container>
        <Container className="d-flex mb-4">
          <Button variant="info" className="text-white" onClick={setCopied}>
            <FontAwesomeIcon icon={faClipboard} />{" "}
            {isCopied ? "Copied!" : "Copy to clipboard"}
          </Button>

          <Button
            variant="success"
            className={`text-white mx-2 ${isRecording ? "d-none" : ""}`}
            onClick={startListening}
          >
            <FontAwesomeIcon icon={faMicrophone} />
          </Button>

          <Button
            variant="danger"
            className={`text-white mx-2 ${isRecording ? "" : "d-none"}`}
            onClick={handleStopRecording}
          >
            <FontAwesomeIcon icon={faStop} />
          </Button>

          <Button
            variant="transparent"
            className="mx-2 px-2"
            style={{ color: "red", fontSize: "18px" }}
            onClick={handleTrashClick}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </Container>
      </Container>
    </Container>
  );
};

export default Main;
