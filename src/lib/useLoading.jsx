import { useEffect, useRef, useState } from "react";
import LoadingModal from "../components/LoadingModal";

export default function useLoading(ms = 1500) {
  const [message, setMessage] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const run = (text, done) => {
    setMessage(text);
    timer.current = setTimeout(() => {
      setMessage(null);
      done();
    }, ms);
  };

  const modal = message ? <LoadingModal message={message} ms={ms} /> : null;

  return { run, modal };
}