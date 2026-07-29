import { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "@/components/Header";
import AsyncState from "@/components/AsyncState";
import Collapsible from "@/components/Collapsible";
import ProductForm from "@/components/ProductForm";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useStaggerIn } from "@/hooks/useStaggerIn";
import { useProducts } from "@/api/queries";
import { useDeleteProduct } from "@/api/products";
import { useAuthStore } from "@/store/useAuthStore";
import type { Product } from "@/api/types";

interface ProductCardProps extends Product {
  className?: string;
  canManage: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard = ({
  _id,
  name,
  description,
  price,
  rating,
  category,
  supply,
  stat,
  className,
  canManage,
  onEdit,
  onDelete,
}: ProductCardProps) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const product: Product = {
    _id,
    name,
    description,
    price,
    rating,
    category,
    supply,
    stat,
  };

  return (
    <Card
      className={className}
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 14, color: theme.palette.secondary[700] }}
          gutterBottom
        >
          {category}
        </Typography>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography sx={{ mb: "1.5rem", color: theme.palette.secondary[400] }}>
          ${Number(price).toFixed(2)}
        </Typography>
        <Rating value={rating} readOnly />
        <Typography variant="body2">{description}</Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="text"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "See Less" : "See More"}
        </Button>
        {canManage && (
          <>
            <Button size="small" onClick={() => onEdit(product)}>
              Edit
            </Button>
            <Button size="small" color="error" onClick={() => onDelete(_id)}>
              Delete
            </Button>
          </>
        )}
      </CardActions>
      <Collapsible open={isExpanded} sx={{ color: theme.palette.neutral[300] }}>
        <CardContent>
          <Typography>id: {_id}</Typography>
          <Typography>Supply Left: {supply}</Typography>
          <Typography>
            Yearly Sales This Year: {stat[0]?.yearlySalesTotal}
          </Typography>
          <Typography>
            Yearly Units Sold This Year: {stat[0]?.yearlyTotalSoldUnits}
          </Typography>
        </CardContent>
      </Collapsible>
    </Card>
  );
};

export default function Products() {
  const { data, isLoading, error } = useProducts();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const gridRef = useStaggerIn(".product-card");

  const role = useAuthStore((s) => s.user?.role);
  const canManage = role === "admin" || role === "superadmin";

  const deleteProduct = useDeleteProduct();

  const [formState, setFormState] = useState<{
    open: boolean;
    initial?: Product;
  }>({ open: false });

  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });

  const handleEdit = (product: Product) => {
    setFormState({ open: true, initial: product });
  };

  const handleDelete = (id: string) => {
    setConfirmState({ open: true, id });
  };

  const handleConfirmDelete = () => {
    if (confirmState.id) {
      deleteProduct.mutate(confirmState.id);
    }
  };

  return (
    <Box sx={{ m: "1.5rem 2.5rem" }}>
      <Header title="PRODUCTS" subtitle="See your list of products." />
      {canManage && (
        <Box sx={{ mt: "1rem" }}>
          <Button
            variant="contained"
            onClick={() => setFormState({ open: true, initial: undefined })}
          >
            Add Product
          </Button>
        </Box>
      )}
      <AsyncState isLoading={isLoading} error={error} data={data}>
        {(products) => (
          <Box
            ref={gridRef}
            sx={{
              mt: "20px",
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              justifyContent: "space-between",
              rowGap: "20px",
              columnGap: "1.33%",
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {products.map((product) => (
              <ProductCard
                key={product._id}
                {...product}
                className="product-card"
                canManage={canManage}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </Box>
        )}
      </AsyncState>

      <ProductForm
        key={formState.initial?._id ?? "new"}
        open={formState.open}
        initial={formState.initial}
        onClose={() => setFormState({ open: false })}
      />

      <ConfirmDialog
        open={confirmState.open}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmState({ open: false, id: null })}
      />
    </Box>
  );
}
