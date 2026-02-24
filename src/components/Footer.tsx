export function Footer() {
  return (
    <footer className="border-t border-border bg-white/5 backdrop-blur-md pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">ElectronicsEcom</h3>
          <p className="text-sm text-muted-foreground">
            The next generation of electronics shopping, powered by AI.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Laptops</li>
            <li>Headphones</li>
            <li>Accessories</li>
            <li>Deals</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Help Center</li>
            <li>Order Tracking</li>
            <li>Shipping Info</li>
            <li>Returns</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>support@electronicsecom.com</li>
            <li>1-800-ELE-ECOM</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ElectronicsEcom. All rights reserved.
      </div>
    </footer>
  );
}
