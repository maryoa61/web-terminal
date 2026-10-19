// آدرس بک‌اند کلودفلرت رو اینجا بذار
const BACKEND_URL = "https://web-terminal-backend.YOUR_SUBDOMAIN.workers.dev";

const term = new Terminal({ cursorBlink: true, fontFamily: \'monospace\', theme: { background: \'#000000\' } });
const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);
term.open(document.getElementById(\'terminal\'));
fitAddon.fit();
term.focus();

const socket = io(BACKEND_URL);

socket.on("connect", () => term.writeln("\r\n*** Connected to Real Linux Server ***\r\n"));
socket.on("output", (data) => term.write(data));
term.onData((data) => socket.emit("input", data));
term.onResize(({cols, rows}) => socket.emit("resize", {cols, rows}));

window.addEventListener("resize", () => fitAddon.fit());
// برای باز شدن کیبورد اندروید
document.getElementById(\'terminal\').addEventListener(\'click\', () => term.focus());
