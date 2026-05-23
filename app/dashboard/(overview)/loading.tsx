import { Metadata } from 'next';
 


export const metadata: Metadata = {
  title: 'Loading',
};
import DashboardSkeleton from "@/app/ui/skeletons";
export default function Loading() {
  return <DashboardSkeleton/>;
}