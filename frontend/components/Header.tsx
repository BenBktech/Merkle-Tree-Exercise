'use client';
import { ConnectButton } from "@rainbow-me/rainbowkit"

const Header = () => {
  return (
    <div className="flex justify-between items-center p-5">
        <div>Logo</div>
        <div>
            <ConnectButton />
        </div>
    </div>
  )
}

export default Header