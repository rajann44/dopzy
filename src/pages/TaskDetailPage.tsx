import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { ClientTaskDetail } from './client/ClientTaskDetail';
import { CoTaskerTaskDetail } from './cotasker/CoTaskerTaskDetail';

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { state } = useAppContext();

  const task = state.tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <h3>Task not found</h3>
      </div>
    );
  }

  // If task belongs to currentUser, they are the client. Otherwise, they are browsing/working on it.
  if (task.clientId === currentUser?.id) {
    return <ClientTaskDetail />;
  } else {
    return <CoTaskerTaskDetail />;
  }
}
export default TaskDetailPage;
