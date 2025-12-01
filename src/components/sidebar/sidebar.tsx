"use client";

import { useState } from "react";
import Image from "next/image";
import * as motion from "motion/react-client";
import {
  Menu,
  Info,
  List,
  Cigarette,
  CigaretteOff,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  MessageSquarePlus,
  MapPinPlus,
  Scale,
  ExternalLink,
  Activity,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { AddressItem, ApartmentItem } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SidebarProps {
  addresses: AddressItem[];
  apartments: ApartmentItem[];
  isLoading: boolean;
  onItemClick: (address: AddressItem) => void;
  onApartmentClick: (apartment: ApartmentItem) => void;
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onFeedbackClick: () => void;
}

export function Sidebar({
  addresses,
  apartments,
  isLoading,
  onItemClick,
  onApartmentClick,
  isCollapsed,
  onCollapsedChange,
  onFeedbackClick,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarContent = (
    <div className="flex h-full flex-col bg-linear-to-b from-background to-muted/30">
      {/* 헤더 */}
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-linear-to-r from-primary/40 to-primary/20 opacity-50 blur" />
            <Image
              src="/logo.svg"
              alt="CleanBreath Logo"
              width={44}
              height={44}
              className="relative rounded-xl"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">CleanBreath</h1>
            <p className="text-xs text-muted-foreground">
              맑은 공기를 위한 지도
            </p>
          </div>
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* 탭 컨텐츠 */}
      <Tabs defaultValue="info" className="flex flex-1 flex-col">
        <TabsList className="mx-4 mt-4 grid w-auto grid-cols-3 bg-muted/50">
          <TabsTrigger
            value="info"
            className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Info size={14} />
            <span>소개</span>
          </TabsTrigger>
          <TabsTrigger
            value="list"
            className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <List size={14} />
            <span>구역</span>
          </TabsTrigger>
          <TabsTrigger
            value="apartments"
            className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Building2 size={14} />
            <span>아파트</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="flex-1 p-4">
          <ServiceInfo onFeedbackClick={onFeedbackClick} />
        </TabsContent>

        <TabsContent value="list" className="flex-1 overflow-hidden p-4">
          <AddressList
            addresses={addresses}
            isLoading={isLoading}
            onItemClick={(address) => {
              onItemClick(address);
              setIsOpen(false);
            }}
          />
        </TabsContent>

        <TabsContent value="apartments" className="flex-1 overflow-hidden p-4">
          <ApartmentList
            apartments={apartments}
            isLoading={isLoading}
            onItemClick={(apartment) => {
              onApartmentClick(apartment);
              setIsOpen(false);
            }}
          />
        </TabsContent>
      </Tabs>

      {/* 하단 액션 버튼 */}
      <div className="border-t p-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onFeedbackClick}
          >
            <MessageSquarePlus size={14} />
            피드백
          </Button>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <Link href="/register">
              <MapPinPlus size={14} />
              구역 등록
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 모바일: Sheet 트리거 버튼 */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-4 z-50 rounded-xl bg-background/80 shadow-lg backdrop-blur-sm md:hidden"
          >
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 md:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>메뉴</SheetTitle>
          </SheetHeader>
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* 데스크탑: 접을 수 있는 사이드바 */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 0 : 380 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden h-full shrink-0 overflow-hidden border-r bg-background md:flex md:flex-col"
        style={{ borderRightWidth: isCollapsed ? 0 : 1 }}
      >
        {sidebarContent}
      </motion.aside>

      {/* 데스크탑: 사이드바 토글 버튼 */}
      <motion.div
        initial={false}
        animate={{ left: isCollapsed ? 16 : 396 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-4 z-50 hidden md:block"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => onCollapsedChange(!isCollapsed)}
          className="rounded-xl bg-background/80 shadow-lg backdrop-blur-sm"
        >
          {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </Button>
      </motion.div>
    </>
  );
}

interface ServiceInfoProps {
  onFeedbackClick: () => void;
}

function ServiceInfo({ onFeedbackClick }: ServiceInfoProps) {
  return (
    <ScrollArea className="h-[calc(100vh-260px)]">
      <div className="space-y-4 pr-2">
        {/* 서비스 소개 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden border-0 bg-linear-to-br from-primary/10 to-primary/5 shadow-sm">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                  <Sparkles size={16} className="text-primary" />
                </div>
                <h3 className="font-semibold">서비스 소개</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                CleanBreath는 안양시의 금연구역과 흡연구역 정보를 제공합니다.
                지도에서 구역을 확인하고, 깨끗한 공기를 마실 수 있는 곳을
                찾아보세요.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 사용 방법 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-0 bg-card/50 shadow-sm">
            <CardContent className="p-4">
              <h3 className="mb-3 font-semibold">사용 방법</h3>
              <div className="space-y-3">
                {[
                  "상단 토글로 금연/흡연구역을 ON/OFF 하세요",
                  "지도의 마커를 클릭하면 상세 정보를 볼 수 있습니다",
                  "목록에서 구역을 선택하면 해당 위치로 이동합니다",
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {i + 1}
                    </div>
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 범례 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-0 bg-card/50 shadow-sm">
            <CardContent className="p-4">
              <h3 className="mb-3 font-semibold">범례</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-green-50 p-2 dark:bg-green-950/30">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 shadow-sm">
                    <CigaretteOff size={14} className="text-white" />
                  </div>
                  <span className="text-sm font-medium">금연구역</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-2 dark:bg-red-950/30">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 shadow-sm">
                    <Cigarette size={14} className="text-white" />
                  </div>
                  <span className="text-sm font-medium">흡연구역</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 법률 안내 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border-0 bg-linear-to-br from-amber-500/10 to-orange-500/5 shadow-sm">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20">
                  <Scale
                    size={16}
                    className="text-amber-600 dark:text-amber-400"
                  />
                </div>
                <h3 className="font-semibold">금연구역 관련 법령</h3>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                국민건강증진법에 따른 금연구역 지정 시설 및 관련 규정을
                확인해보세요.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                asChild
              >
                <Link href="/statute">
                  <Scale size={14} />
                  자세히 보러가기
                  <ExternalLink size={12} />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* 서버 상태 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="border-0 bg-linear-to-br from-blue-500/10 to-cyan-500/5 shadow-sm">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                  <Activity
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <h3 className="font-semibold">서버 상태</h3>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                API 서버와 데이터베이스의 실시간 상태를 확인할 수 있습니다.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                asChild
              >
                <Link href="/health">
                  <Activity size={14} />
                  상태 확인하기
                  <ExternalLink size={12} />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ScrollArea>
  );
}

interface AddressListProps {
  addresses: AddressItem[];
  isLoading: boolean;
  onItemClick: (address: AddressItem) => void;
}

function AddressList({ addresses, isLoading, onItemClick }: AddressListProps) {
  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!addresses.length) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-muted-foreground">데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <div className="space-y-1.5 pr-2">
        {addresses.map((address, index) => (
          <motion.div
            key={address.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.5) }}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-card/50 p-2 transition-all hover:bg-accent"
            onClick={() => onItemClick(address)}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                address.category === "SMOKING" ? "bg-red-500" : "bg-green-500"
              )}
            >
              {address.category === "SMOKING" ? (
                <Cigarette size={14} className="text-white" />
              ) : (
                <CigaretteOff size={14} className="text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {address.addressName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {address.buildingName}
              </p>
            </div>
            <Badge
              variant="secondary"
              className={cn(
                "shrink-0 px-1.5 py-0.5 text-[10px]",
                address.category === "SMOKING"
                  ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                  : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
              )}
            >
              {address.category === "SMOKING" ? "흡연" : "금연"}
            </Badge>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
}

interface ApartmentListProps {
  apartments: ApartmentItem[];
  isLoading: boolean;
  onItemClick: (apartment: ApartmentItem) => void;
}

function ApartmentList({
  apartments,
  isLoading,
  onItemClick,
}: ApartmentListProps) {
  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!apartments.length) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-muted-foreground">데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <div className="space-y-1.5 pr-2">
        {apartments.map((apartment, index) => (
          <motion.div
            key={apartment.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.5) }}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-card/50 p-2 transition-all hover:bg-accent"
            onClick={() => onItemClick(apartment)}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500">
              <Building2 size={14} className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {apartment.apartmentName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {apartment.address}
              </p>
            </div>
            <Badge
              variant="secondary"
              className="shrink-0 bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-700 dark:bg-blue-950 dark:text-blue-300"
            >
              {apartment.numberOfBuilding}동
            </Badge>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
}
