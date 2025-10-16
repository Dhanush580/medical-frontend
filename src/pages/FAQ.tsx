const FAQ = () => {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <div className="space-y-4 text-lg text-muted-foreground">
          <div>
            <div className="font-semibold">Q: How do I subscribe?</div>
            <div>A: Click Get Started and complete signup. You'll be charged after payment verification.</div>
          </div>
          <div>
            <div className="font-semibold">Q: Can I add family members?</div>
            <div>A: Yes — add family members during signup. Each member costs ₹365 and a 10% discount is applied to the total.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
