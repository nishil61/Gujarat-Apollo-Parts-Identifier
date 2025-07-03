import React from 'react';

function App() {
  // Redirect to the actual project application
  React.useEffect(() => {
    window.location.href = '/project/';
  }, []);

  return (
    <div>
      <h1>Gujarat Apollo Parts Identifier</h1>
      <p>Redirecting to application...</p>
    </div>
  );
}

export default App;