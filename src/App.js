import './App.scss';
import Systems from './modules/Systems/Systems';
import TopContent from './modules/TopContent/TopContent';
import TopHeader from './modules/TopHeader/TopHeader';

function App() {
  return (
    <div>
      <TopHeader></TopHeader>
      <TopContent></TopContent>
      <Systems></Systems>
    </div>
  );
}

export default App;
