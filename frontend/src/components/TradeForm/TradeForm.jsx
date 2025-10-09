import React, { useState } from "react";

const TradeForm = ({ initialSymbol }) => {
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quantity || parseFloat(quantity) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: initialSymbol,
          side: "BUY",
          quantity: parseFloat(quantity),
        }),
      });

      // Check if response is OK
      if (!res.ok) {
        const text = await res.text(); // get actual server response
        alert("Failed to place order: " + text);
        setLoading(false);
        return;
      }

      const data = await res.json();
      alert("Order placed successfully: " + JSON.stringify(data));
      setQuantity("");
    } catch (err) {
      console.error("Trade Error:", err);
      alert("Failed to place order. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <h3>Trade {initialSymbol}</h3>
      <input
        type="number"
        step="any"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Placing Order..." : "Buy"}
      </button>
    </form>
  );
};

export default TradeForm;
