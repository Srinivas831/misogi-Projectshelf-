"use client"

import { useParams } from "next/navigation"
import { PortfolioForm } from "@/components/PortfolioForm"

export default function EditPortfolioPage() {
  const params = useParams()
  const portfolioId = params.id as string

  return <PortfolioForm mode="edit" portfolioId={portfolioId} />
}
