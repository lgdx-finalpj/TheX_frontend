import Router from "@/routes/Router";
import { MoodCustomDraftProvider } from "@/state/MoodCustomDraftProvider";

function App() {
  return (
    <MoodCustomDraftProvider>
      <Router />
    </MoodCustomDraftProvider>
  );
}

export default App;
