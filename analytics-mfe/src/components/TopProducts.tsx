import { Package } from 'lucide-react';

interface TopProductsProps {
  data: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
}

export default function TopProducts({ data }: TopProductsProps) {
  const maxRevenue = data.length > 0 ? Math.max(...data.map(p => p.revenue)) : 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Top Products</h3>
      </div>
      {data.length > 0 ? (
        <div className="space-y-4">
          {data.map((product, index) => {
            const percentage = maxRevenue > 0 ? (product.revenue / maxRevenue) * 100 : 0;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
                      {product.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground">
                      ${product.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {product.quantity} sold
                    </div>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
          <Package className="h-12 w-12 mb-2 opacity-50" />
          <p>No product data available</p>
        </div>
      )}
    </div>
  );
}
