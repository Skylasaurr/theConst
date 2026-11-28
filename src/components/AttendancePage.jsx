
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { fullName } from "../lib/format";

export default function AttendancePage({ data, notify, onBack }) {
  const { employees, attendance, clockIn, clockOut } = data;

  const [employeeId, setEmployeeId] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [scanning, setScanning] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);

  const inputRef = useRef(null);
  const scannerRef = useRef(null);
  const processingRef = useRef(false);
  const lastScannedIdRef = useRef(null);
  const noQrFramesRef = useRef(0);
  const attendanceRef = useRef(attendance);
  attendanceRef.current = attendance;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;

      if (scanner?.isScanning) {
        scanner.stop()
          .then(() => scanner.clear())
          .catch(() => {});
      } else if (scanner) {
        scanner.clear();
      }
    };
  }, []);

  const processAttendance = (value) => {
    const id = value.trim().toLowerCase();

    if (!id) return;

    const employee = employees.find(
      (item) => item.no.toLowerCase() === id
    );

    if (!employee) {
      notify("Employee ID not found. Please try again.");
      setEmployeeId("");
      inputRef.current?.focus();
      return;
    }

    const record = attendanceRef.current[employee.id];

    if (!record?.timeIn) {
      clockIn(employee.id);
      notify(`Time In recorded for ${fullName(employee)}.`);
    } else if (!record.timeOut) {
      clockOut(employee.id);
      notify(`Time Out recorded for ${fullName(employee)}.`);
    } else {
      notify("Attendance already completed for today.");
    }

    setEmployeeId("");
    inputRef.current?.focus();
  };

  const submitAttendance = (e) => {
    e.preventDefault();
    processAttendance(employeeId);
  };

  const startScanner = async () => {
    if (cameraStarting || scanning) return;

    let permissionStream = null;

    try {
      setCameraStarting(true);
      processingRef.current = false;
      lastScannedIdRef.current = null;
      noQrFramesRef.current = 0;

      permissionStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      const devices = await navigator.mediaDevices.enumerateDevices();

      const cameras = devices.filter(
        (device) => device.kind === "videoinput"
      );

      const selectedCamera =
        cameras.find((device) =>
          device.label.toLowerCase().includes("hp wide vision")
        ) || cameras[0];

      permissionStream.getTracks().forEach((track) => track.stop());
      permissionStream = null;

      if (!selectedCamera) {
        notify("No camera found. Please check your camera connection.");
        return;
      }

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("attendance-qr-reader");
      }

      const scanner = scannerRef.current;

      if (scanner.isScanning) return;

      await scanner.start(
        selectedCamera.deviceId,
        {
          fps: 10,
          qrbox: (width, height) => {
            const size = Math.floor(Math.min(width, height) * 0.7);
            return { width: size, height: size };
          },
          aspectRatio: 1,
        },
        (decodedText) => {
          noQrFramesRef.current = 0;

          if (processingRef.current) return;

          const scannedId = decodedText.trim().toLowerCase();
          if (scannedId === lastScannedIdRef.current) return;

          processingRef.current = true;
          lastScannedIdRef.current = scannedId;
          try {
            processAttendance(decodedText);
          } finally {
            processingRef.current = false;
          }
        },
        () => {
          if (!lastScannedIdRef.current) return;

          noQrFramesRef.current += 1;
          if (noQrFramesRef.current >= 20) {
            lastScannedIdRef.current = null;
            noQrFramesRef.current = 0;
          }
        },
      );

      setScanning(true);
    } catch (error) {
      console.error("Camera error:", error);

      if (error.name === "NotAllowedError") {
        notify(
          "Camera access denied. Please allow camera access in your browser."
        );
      } else {
        notify("Camera could not start. Please check your camera.");
      }
    } finally {
      if (permissionStream) {
        permissionStream.getTracks().forEach((track) => track.stop());
      }

      setCameraStarting(false);
    }
  };

  const stopScanner = async () => {
    const scanner = scannerRef.current;
    processingRef.current = true;
    lastScannedIdRef.current = null;
    noQrFramesRef.current = 0;

    if (scanner?.isScanning) {
      try {
        await scanner.stop();
      } catch (error) {
        console.log("Scanner stop:", error);
      }
    }

    setScanning(false);
  };

  const getStatus = (record) => {
    if (!record?.timeIn) return "Not yet timed in";
    if (!record.timeOut) return "Working";
    return "Completed";
  };

  return (
    <main
      className="min-h-screen w-full bg-cover bg-center bg-fixed p-3 md:p-6"
      style={{
        backgroundImage: "url('/impig-attendance-background.png')",
      }}
    >
      <div className="fixed inset-0 bg-[#003e30]/75" />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Header */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 text-white">
          <div>
            <p className="mb-1 text-sm font-bold tracking-[0.25em] text-amber-400">
              IMPIG CONSTRUCTION SUPPLY
            </p>

            <h1 className="text-2xl font-extrabold md:text-3xl">
              Employee Attendance
            </h1>

            <p className="mt-1 text-sm text-white/80">
              Time In and Time Out Monitoring
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-white/40 bg-white/10 px-5 py-2 font-semibold text-white transition hover:bg-white/20"
          >
            Back
          </button>
        </header>

        {/* Main Content */}
        <div className="grid items-start gap-5 lg:grid-cols-[0.9fr_1.1fr]">

          {/* Scanner Section */}
          <section className="rounded-2xl border border-white/50 bg-white/95 p-5 shadow-2xl backdrop-blur-md md:p-7">

            <div className="mb-5 text-center">
              <p className="text-sm font-medium text-gray-500">
                {currentTime.toLocaleDateString("en-PH", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              <p className="mt-1 text-4xl font-extrabold tracking-tight text-[#064e3b] md:text-5xl">
                {currentTime.toLocaleTimeString("en-PH", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>

            <h2 className="mb-4 text-center text-lg font-extrabold tracking-wide text-[#075c3b]">
              SCAN YOUR ID
            </h2>

            {/* QR Scanner */}
            <div className="relative mx-auto h-[230px] w-[230px] max-w-full overflow-hidden rounded-xl bg-black">
              <div
                id="attendance-qr-reader"
                className="absolute inset-0 h-full w-full overflow-hidden [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
              />

              {!scanning && (
                <button
                  type="button"
                  onClick={startScanner}
                  disabled={cameraStarting}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-amber-400 bg-[#fffbed] px-4 text-center transition hover:bg-amber-50 disabled:cursor-wait"
                  aria-label="Start QR scanner"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="42"
                    height="42"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#087443"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 3H5a2 2 0 0 0-2 2v2" />
                    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                    <path d="M3 17v2a2 2 0 0 0 2 2h2" />
                    <rect x="7" y="7" width="10" height="10" rx="1" />
                    <path d="M10 10h4M10 13h4" />
                  </svg>

                  <span className="text-base font-extrabold text-[#172d25]">
                    {cameraStarting ? "OPENING CAMERA..." : "SCAN YOUR ID"}
                  </span>

                  <span className="text-xs text-gray-500">
                    Hold your QR code near the scanner
                  </span>
                </button>
              )}
            </div>

            {scanning && (
              <button
                type="button"
                onClick={stopScanner}
                className="mt-3 w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                Stop Camera
              </button>
            )}

            {/* Manual Entry */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-300" />

              <span className="text-xs font-medium text-gray-500">
                OR ENTER MANUALLY
              </span>

              <div className="h-px flex-1 bg-gray-300" />
            </div>

            <form onSubmit={submitAttendance}>
              <label
                htmlFor="attendance-id"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Employee ID
              </label>

              <input
                ref={inputRef}
                id="attendance-id"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter Employee ID (e.g. E-001)"
                autoComplete="off"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center text-base text-gray-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />

              <button
                type="submit"
                className="mt-3 w-full rounded-lg bg-amber-500 px-4 py-3 font-bold text-gray-950 shadow-sm transition hover:bg-amber-400"
              >
                Submit Attendance
              </button>
            </form>
          </section>

          {/* Today's Log */}
          <section className="rounded-2xl border border-white/60 bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.20)] md:p-7">

            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-amber-600">
                  DAILY RECORDS
                </p>

                <h2 className="mt-1 text-2xl font-extrabold text-[#123d30]">
                  Today's Log
                </h2>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                {employees.length} Employees
              </span>
            </div>

            {/* Table with Shadow */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-md shadow-gray-300/60">
              <table className="w-full min-w-[540px] border-separate border-spacing-0 text-left text-sm">

                <thead className="bg-gray-50">
                  <tr className="text-xs uppercase tracking-wide text-gray-500">
                    <th className="border-b border-gray-200 px-4 py-4">
                      Employee
                    </th>

                    <th className="border-b border-gray-200 px-4 py-4">
                      ID
                    </th>

                    <th className="border-b border-gray-200 px-4 py-4">
                      Time In
                    </th>

                    <th className="border-b border-gray-200 px-4 py-4">
                      Time Out
                    </th>

                    <th className="border-b border-gray-200 px-4 py-4">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((employee) => {
                    const record = attendance[employee.id];
                    const status = getStatus(record);

                    return (
                      <tr
                        key={employee.id}
                        className="transition hover:bg-amber-50/70"
                      >
                        <td className="border-b border-gray-100 px-4 py-4 font-semibold text-gray-800">
                          {fullName(employee)}
                        </td>

                        <td className="border-b border-gray-100 px-4 py-4 text-gray-600">
                          {employee.no}
                        </td>

                        <td className="border-b border-gray-100 px-4 py-4 text-gray-700">
                          {record?.timeIn || "-"}
                        </td>

                        <td className="border-b border-gray-100 px-4 py-4 text-gray-700">
                          {record?.timeOut || "-"}
                        </td>

                        <td className="border-b border-gray-100 px-4 py-4">
                          <span
                            className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${
                              status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : status === "Working"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <footer className="mt-5 text-center text-xs text-white/75">
          IMPIG Construction Supply · Workflow Management System
        </footer>
      </div>
    </main>
  );
}
