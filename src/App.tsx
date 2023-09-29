import { useState, useEffect } from 'react'
import { User } from 'firebase/auth';
import LoginComponent from './components/Login/Login';
import AuthService from './services/auth-service';
import Home from './components/Home/Home';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const onUserChanged = (user: User | null) => setUser(user);
    AuthService.getInstance().subscribe(onUserChanged);

    // Cleanup the subscription on component unmount
    return () => AuthService.getInstance().unsubscribe(onUserChanged);
  }, []);

  if (user === null) {
    return <LoginComponent />;
  } else {
    return (
          <Home user={user} />
    );
  }
}

export default App;
