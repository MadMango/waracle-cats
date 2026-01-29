import ReactDOM from 'react-dom/client';
import App from './App';

// biome-ignore lint/style/noNonNullAssertion: should have root :)
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
