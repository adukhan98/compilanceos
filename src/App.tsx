import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext.tsx';
import { Layout } from './components/Layout.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { Customers } from './pages/Customers.tsx';
import { CustomerDetail } from './pages/CustomerDetail.tsx';
import { QuestionnaireDetail } from './pages/QuestionnaireDetail.tsx';
import { AnswerLibrary } from './pages/AnswerLibrary.tsx';
import { Timeline } from './pages/Timeline.tsx';

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:customerId" element={<CustomerDetail />} />
            <Route
              path="customers/:customerId/questionnaires/:questionnaireId"
              element={<QuestionnaireDetail />}
            />
            <Route path="answers" element={<AnswerLibrary />} />
            <Route path="timeline" element={<Timeline />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
