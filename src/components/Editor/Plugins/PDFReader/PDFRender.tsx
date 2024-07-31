'use client'

import React from "react"

export const PDFRender: React.FC<{ props: any }> = ({props}) => {
    return (
      <>
        <embed 
            src={props.block.props.url} 
            type="application/pdf" 
            style={{ width: '100vh', height: '100vh' }} 
            contentEditable={false}
            draggable={false}
        />
      </> 
    );
}