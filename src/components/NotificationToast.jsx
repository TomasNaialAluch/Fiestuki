import { useUI } from '../context/UIContext';

export default function NotificationToast() {
  const { notifications, removeNotification } = useUI();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm
            transform transition-all duration-300 ease-in-out
            ${notification.type === 'success' ? 'bg-green-500 text-white' : ''}
            ${notification.type === 'error' ? 'bg-red-500 text-white' : ''}
            ${notification.type === 'warning' ? 'bg-yellow-500 text-white' : ''}
            ${notification.type === 'info' ? 'bg-blue-500 text-white' : ''}
            ${notification.type === 'default' ? 'bg-[#FF6B35] text-white' : ''}
          `}
        >
          <span className="text-sm font-baloo font-semibold flex-1">
            {notification.message}
          </span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-white hover:text-gray-200 text-lg font-bold transition-colors"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

