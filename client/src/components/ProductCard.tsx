import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: "Parque Infantil" | "Casa de Madera";
  startingPrice: number;
}

export default function ProductCard({
  id,
  title,
  description,
  imageUrl,
  category,
  startingPrice,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all" data-testid={`card-product-${id}`}>
      <CardHeader className="p-0">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            data-testid={`img-product-${id}`}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Badge className="mb-3" data-testid={`badge-category-${id}`}>
          {category}
        </Badge>
        <h3 className="text-xl font-semibold mb-2" data-testid={`text-title-${id}`}>
          {title}
        </h3>
        <p className="text-muted-foreground" data-testid={`text-description-${id}`}>
          {description}
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Desde</div>
          <div className="text-2xl font-bold text-primary" data-testid={`text-price-${id}`}>
            Bs {startingPrice.toLocaleString()}
          </div>
        </div>
        <Link href={`/configurador?type=${category.toLowerCase().replace(" ", "-")}`}>
          <Button data-testid={`button-customize-${id}`} className="hover-elevate active-elevate-2">
            Personalizar
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
