import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/molecule/Header';
import { Icon } from '@/components/molecule/Icon';
import { useTheme } from '@/theme/ThemeContext';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  order_date: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { theme } = useTheme();

  // Simulated data loading - replace with actual API call when available
  useEffect(() => {
    // Sample data - replace with your API call
    const mockOrders = [
      {
        id: 1,
        order_number: 'ORD-2025-001',
        customer_name: 'John Doe',
        total_amount: 1250.50,
        status: 'completed' as const,
        order_date: '2025-07-05T10:30:00Z'
      },
      {
        id: 2,
        order_number: 'ORD-2025-002',
        customer_name: 'Jane Smith',
        total_amount: 780.25,
        status: 'processing' as const,
        order_date: '2025-07-08T14:45:00Z'
      },
      {
        id: 3,
        order_number: 'ORD-2025-003',
        customer_name: 'Robert Johnson',
        total_amount: 450.00,
        status: 'pending' as const,
        order_date: '2025-07-10T09:15:00Z'
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="container-fluid p-0">
        <Header data={null} />
        <div className="container-fluid p-5 text-center bg-body-custom">
          <div className="skeleton-box" style={{ width: '100%', height: 100, margin: '0 auto', borderRadius: 16 }} />
          <div className="row mt-4">
            {[1, 2, 3].map((item) => (
              <div className="col-12 mb-3" key={item}>
                <div className="skeleton-box" style={{ width: '100%', height: 80, borderRadius: 16, margin: '0 auto' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'processing':
        return 'bg-primary';
      case 'pending':
        return 'bg-warning';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container-fluid p-0 bg-body-custom">
      <Header data={null} />
      <div className="container-fluid bg-body-custom">
        <div className="row py-4 px-4">
          <div className="col-12 d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-body-custom m-0">Orders</h2>
          </div>

          <div className="col-12">
            <div className="card bg-card-custom border-card-custom">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="text-body-custom">Order #</th>
                        <th className="text-body-custom">Customer</th>
                        <th className="text-body-custom">Date</th>
                        <th className="text-body-custom">Amount</th>
                        <th className="text-body-custom">Status</th>
                        <th className="text-body-custom">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="text-body-custom">{order.order_number}</td>
                          <td className="text-body-custom">{order.customer_name}</td>
                          <td className="text-body-custom">{formatDate(order.order_date)}</td>
                          <td className="text-body-custom">₹{order.total_amount.toFixed(2)}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <Link to={`/orders/${order.id}`} className="btn btn-sm btn-outline-primary me-2">
                              <Icon name="Eye" size={16} /> View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
