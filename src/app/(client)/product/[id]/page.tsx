import ProductDetailClient from '@/components/detail/ProductDetailClient';

const ProductDetailPage = async ({ params }: { params: { id: string } }) => {
    const res = await fetch(`http://localhost:8080/api/v1/restaurants/${params.id}/details`, { cache: 'no-store' });
    const result = await res.json();
    return <ProductDetailClient data={result.data} />;
};

export default ProductDetailPage; 