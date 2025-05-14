const BACKEND_URL = 'https://reawake-server.onrender.com'; // Thay bằng URL của backend chính
const KEEP_ALIVE_INTERVAL = 10 * 60 * 1000; // 10 phút (600,000 ms)

async function sendKeepAliveRequest() {
  const statusElement = document.getElementById('status');
  try {
    const response = await fetch(`${BACKEND_URL}/keep-alive`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const timestamp = new Date().toLocaleString();
    if (response.status === 204) {
      statusElement.textContent = `Running... (Last request sent at ${timestamp})`;
    } else {
      statusElement.textContent = `Error: Unexpected response status ${response.status} at ${timestamp}`;
    }
  } catch (error) {
    const timestamp = new Date().toLocaleString();
    statusElement.textContent = `Error: ${error.message} at ${timestamp}`;
    console.error('Error sending keep-alive request:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Gửi request đầu tiên ngay lập tức
  sendKeepAliveRequest();

  // Thiết lập interval để gửi request mỗi 10 phút
  const keepAliveIntervalId = setInterval(sendKeepAliveRequest, KEEP_ALIVE_INTERVAL);

  // Dừng interval khi trang bị đóng (tránh rò rỉ bộ nhớ)
  window.addEventListener('unload', () => {
    clearInterval(keepAliveIntervalId);
  });
});