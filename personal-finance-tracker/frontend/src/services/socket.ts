import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    const SOCKET_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
    this.socket = io(SOCKET_URL);
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onTransactionAdded(callback: (transaction: any) => void) {
    if (this.socket) {
      this.socket.on('transaction-added', callback);
    }
  }

  onTransactionDeleted(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('transaction-deleted', callback);
    }
  }

  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export default new SocketService();