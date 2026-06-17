import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatDate';

export default function UserRow({ user }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="text-sm font-medium text-gray-900 truncate max-w-[160px]">{user.email}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant={user.role}>{user.role}</Badge>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(user.createdAt)}</td>
      <td className="px-4 py-3">
        <span className="text-xs font-mono text-gray-400">{user.id?.slice(0, 12)}...</span>
      </td>
    </tr>
  );
}
