import MomoResultClient from '@/components/payment/MomoResultClient';

export default function MomoPage({ searchParams }: { searchParams: { [key: string]: string } }) {
    return <MomoResultClient searchParams={searchParams} />;
}
