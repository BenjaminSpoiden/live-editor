import { cn } from "@/lib/utils";
import React, { PropsWithChildren } from "react";


export const Header: React.FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <div className={cn('header', className)}>
        {children}
    </div>
)