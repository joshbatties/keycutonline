"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/types"
import { convertOrdersToCSV, downloadCSV } from "@/lib/csv-utils"
import { Loader2, Eye, CheckCircle, XCircle, Download, Settings } from "lucide-react"

export function OrdersTable() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())
  const [bulkStatus, setBulkStatus] = useState<string>("")
  const [isBulkUpdating, setIsBulkUpdating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      })

      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error("[v0] Failed to update order:", error)
    }
  }

  const handleVerification = async (orderId: string, status: "approved" | "rejected") => {
    setIsVerifying(true)
    try {
      const response = await fetch("/api/admin/orders/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, verificationStatus: status }),
      })

      if (response.ok) {
        fetchOrders()
        setSelectedOrder(null)
      }
    } catch (error) {
      console.error("[v0] Failed to verify order:", error)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    const newSelected = new Set(selectedOrders)
    if (checked) {
      newSelected.add(orderId)
    } else {
      newSelected.delete(orderId)
    }
    setSelectedOrders(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(new Set(orders.map(order => order.id)))
    } else {
      setSelectedOrders(new Set())
    }
  }

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedOrders.size === 0) return

    setIsBulkUpdating(true)
    try {
      const response = await fetch("/api/admin/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "update_status",
          type: "orders",
          ids: Array.from(selectedOrders),
          data: { status: bulkStatus }
        }),
      })

      if (response.ok) {
        fetchOrders()
        setSelectedOrders(new Set())
        setBulkStatus("")
      }
    } catch (error) {
      console.error("Failed to update bulk status:", error)
    } finally {
      setIsBulkUpdating(false)
    }
  }

  const handleExportCSV = async () => {
    if (selectedOrders.size === 0) return

    setIsExporting(true)
    try {
      const response = await fetch("/api/admin/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "export_csv",
          type: "orders",
          ids: Array.from(selectedOrders)
        }),
      })

      if (response.ok) {
        const { data } = await response.json()
        const csvContent = convertOrdersToCSV(data)
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')
        downloadCSV(csvContent, `orders-${timestamp}.csv`)
      }
    } catch (error) {
      console.error("Failed to export CSV:", error)
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (orders.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No orders yet</p>
  }

  return (
    <>
      {/* Bulk Operations Header */}
      {selectedOrders.size > 0 && (
        <div className="mb-4 p-4 bg-muted rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {selectedOrders.size} order{selectedOrders.size === 1 ? '' : 's'} selected
            </p>
            <div className="flex items-center gap-2">
              <Select value={bulkStatus} onValueChange={setBulkStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="New Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="cutting">Cutting</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleBulkStatusUpdate}
                disabled={!bulkStatus || isBulkUpdating}
                size="sm"
              >
                {isBulkUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    Update Status
                  </>
                )}
              </Button>
              <Button
                onClick={handleExportCSV}
                disabled={isExporting}
                variant="outline"
                size="sm"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedOrders.size === orders.length && orders.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Key Type</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedOrders.has(order.id)}
                    onCheckedChange={(checked) => handleSelectOrder(order.id, !!checked)}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell className="capitalize">{order.key_type}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{formatCurrency(order.total_cents)}</TableCell>
                <TableCell>
                  <Badge variant={order.payment_status === "paid" ? "default" : "secondary"}>
                    {order.payment_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.requires_verification ? (
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          order.verification_status === "approved"
                            ? "default"
                            : order.verification_status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {order.verification_status}
                      </Badge>
                      {order.verification_status === "pending" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Verify Key Photos</DialogTitle>
                              <DialogDescription>
                                Review the photos to verify ownership before cutting restricted keys
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm font-medium mb-2">Order Details:</p>
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <p>Order ID: {order.id}</p>
                                  <p>Key Type: {order.key_type}</p>
                                  <p>Quantity: {order.quantity}</p>
                                  <p>Customer: {order.email}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-2">Key Photos:</p>
                                <div className="grid grid-cols-2 gap-4">
                                  {order.photo_urls?.map((url: string, idx: number) => (
                                    <img
                                      key={idx}
                                      src={url || "/placeholder.svg"}
                                      alt={`Key photo ${idx + 1}`}
                                      className="w-full h-64 object-cover rounded-lg border"
                                    />
                                  ))}
                                </div>
                              </div>
                              {order.verification_photo_url && (
                                <div>
                                  <p className="text-sm font-medium mb-2">Verification Photo:</p>
                                  <img
                                    src={order.verification_photo_url || "/placeholder.svg"}
                                    alt="Verification"
                                    className="w-full h-64 object-cover rounded-lg border"
                                  />
                                </div>
                              )}
                              <div className="flex gap-3 pt-4">
                                <Button
                                  onClick={() => handleVerification(order.id, "approved")}
                                  disabled={isVerifying}
                                  className="flex-1"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => handleVerification(order.id, "rejected")}
                                  disabled={isVerifying}
                                  variant="destructive"
                                  className="flex-1"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "delivered" ? "default" : order.status === "shipped" ? "secondary" : "outline"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="cutting">Cutting</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
