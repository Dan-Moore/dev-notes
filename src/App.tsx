
import { PageMenu, refresh } from "./components/web/page-menu";
import { useState } from 'react'
import "./index.css";



export function App() {
  refresh(true)
  return (
    <>
    <main className="">
      <PageMenu>
        <div className="">


        </div>
      </PageMenu>
    </main>
    </>
  );
}



export default App();