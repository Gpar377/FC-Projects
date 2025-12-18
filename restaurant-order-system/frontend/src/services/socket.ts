import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    this.socket = io('http://localhost:5000');
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinAdmin() {
    if (this.socket) {
      this.socket.emit('join-admin');
    }
  }

  onNewOrder(callback: (order: any) => void) {
    if (this.socket) {
      this.socket.on('new-order', callback);
    }
  }

  onOrderStatusUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('order-status-update', callback);
    }
  }

  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

const socketService = new SocketService();
export default socketService;