import styles from './App.module.scss';
import { MessageList } from '../src/components/MessageList';
import { LoginBox } from '../src/components/LoginBox';
import { useContext } from 'react';
import { AuthContext } from './context/auth';
import { SendMessageForm } from './components/SendMessageForm';

export function App() {

	// This user sets the component to show
	const { user } = useContext(AuthContext);

  return (
    <main className={styles.contentWrapper}>
			<MessageList />
			{ !!user ? <SendMessageForm/> : <LoginBox />}
		</main>
  );
}