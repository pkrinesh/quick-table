import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-4">quick-table Playground</h1>
        <p className="text-muted-foreground mb-6">
          TanStack Table wrapper that makes tables easy to build.
        </p>
        <Button>Get Started</Button>
      </div>
    </div>
  );
}

export default App;
