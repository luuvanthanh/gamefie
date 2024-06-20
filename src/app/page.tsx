'use client';
import { PointApi } from "@/apis/points";
import Image from "next/image";
import React, { useEffect, useRef, useState } from 'react'

interface ClickPosition {
  x: number;
  y: number;
  id: number;
}

const Home = () => {
  const [point, setPoint] = useState<number>(0);
  const [clickPositions, setClickPositions] = useState<ClickPosition[]>([]);
  const [height, setHeight] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(0);
  const [energyApi, setEnergyApi] = useState<number>(1000);
  const elementRef = useRef<HTMLDivElement>(null);
  const eranPerTap = 1;
  const userId = 1;

  const fetchPoint = async () => {
    try {
      const res = await PointApi.getPoint(userId);
      setPoint(res[0].points);
    } catch (error) {
      console.error('Error fetching point:', error);
    }
  };

  const addPoint = async () => {
    try {
      const res = await PointApi.addPoint(userId, {point: 100});
      // setPoint(res[0].points);
    } catch (error) {
      console.error('Error fetching point:', error);
    }
  };

  useEffect(() => {
    fetchPoint();
  }, []);

  useEffect(()=> {
    // setPoint(Number(localStorage.getItem('pointHamster')));

    if (elementRef.current) {
      const clientHeight = elementRef.current.clientHeight;
      setHeight(clientHeight)
    }
  }, [point]);

  useEffect(() => {
    setEnergy(energyApi);
  }, []);

  // reset energy when click hamster
  useEffect(() => {
    if (energy < energyApi) {
      const timer = setTimeout(() => {
        setEnergy((prevEnergy) => Math.min(prevEnergy + 3, energyApi));
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (energy > energyApi) {
      console.log(energy, 'ngoaif');
    }      
    
  }, [energy, energyApi]);

  const handleIncreasePoint = (event: any) => {
    addPoint();
    // increase point
    let current = Number(point) + eranPerTap;
    localStorage.setItem('pointHamster', current.toString());
    setPoint(current);
    const { clientX, clientY } = event;
    const y = clientY - height;

    const newClickPosition: ClickPosition = {
      x: clientX,
      y: y,
      id: Date.now(),
    };
    // set location
    setClickPositions((prevPositions) => [
      ...prevPositions,
      newClickPosition,
    ]);

    setTimeout(() => {
      setClickPositions((prevPositions) =>
        prevPositions.filter((pos) => pos.id !== newClickPosition.id)
      );
    }, 300);

    let currentEnergy = energy - eranPerTap;
    if (currentEnergy >= 0) {
      setEnergy(currentEnergy);
    }
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container">
        <div className="stats">
          <div className="stat">
            <div className="label">Earn per tap</div>
            <div className="content">
              <Image
                className="img"
                src="/images/dolar.webp"
                alt="Hamster"
                width={18}
                height={18}
                priority
              />
              <div className="value">+1</div>
            </div>
          </div>
          <div className="stat">
            <div className="label">Coins to level up</div>
            <div className="content">
              <Image
                className="img"
                src="/images/dolar.webp"
                alt="Hamster"
                width={18}
                height={18}
                priority
              />
              <div className="value">5K</div>
            </div>
          </div>
          <div className="stat">
            <div className="label">Profit per hour</div>
            <div className="content">
              <Image
                className="img"
                src="/images/dolar.webp"
                alt="Hamster"
                width={18}
                height={18}
                priority
              />
              <div className="value">0</div>
            </div>
          </div>
        </div>
        <div className="balance">
          <Image
            className="img"
            src="/images/dolar.webp"
            alt="Hamster"
            width={60}
            height={60}
            priority
          />
          <div className="value">{point}</div>
        </div>
        <div className="bronze">
          <div className="bronze-left">
            <div className="value">Bronze ></div>
          </div>
          <div className="bronze-right">
            <div className="value"><span className="level">Level</span> 1/10</div>
          </div>
        </div>
        <div className="progressbar">
          <div className="progress"></div>
        </div>
        <div className="avatar-full-width" ref={elementRef} onClick={handleIncreasePoint}>
        {clickPositions.map((pos) => (
          <div
            key={pos.id}
            className="value-animation"
            style={{ left: pos.x, top: pos.y, '--top': `${pos.y}px` } as React.CSSProperties}
          >
            +{eranPerTap}
          </div>
        ))}
          <div className="avatar">
            <Image
              className="img"
              src="/images/hamster-avatar.png"
              alt="Hamster"
              width={100}
              height={24}
              priority
            />
          </div>
        </div>
        <div className="energy">
          <div className="energy-consumption">
            <Image
              className="img"
              src="/images/energy.png"
              alt="Hamster"
              width={30}
              height={30}
              priority
            />
            <div className="value">{energy} / {energyApi}</div>
          </div>
          <div className="energy-boost">
            <Image
              className="img"
              src="/images/boost.png"
              alt="Hamster"
              width={30}
              height={30}
              priority
            />
            <div className="value">Boost</div>
          </div>
        </div>
        <div className="buttons">
          <div className="button">
            <Image
              className="img"
              src="/images/exchange.png"
              alt="Hamster"
              width={30}
              height={30}
              priority
            />
            <div className="label">Exchange</div>
          </div>
          <div className="button">
            <Image
              className="img"
              src="/images/mine.png"
              alt="Hamster"
              width={100}
              height={24}
              priority
            />
            <div className="label">Mine</div>
          </div>
          <div className="button">
            <Image
              className="img"
              src="/images/friends.png"
              alt="Hamster"
              width={100}
              height={24}
              priority
            />
            <div className="label">Friends</div>
          </div>
          <div className="button">
            <Image
              className="img"
              src="/images/earn.png"
              alt="Hamster"
              width={100}
              height={24}
              priority
            />
            <div className="label">Earn</div>
          </div>
          <div className="button">
            <Image
              className="img"
              src="/images/dolar.webp"
              alt="Hamster"
              width={100}
              height={24}
              priority
            />
            <div className="label">Airdrop</div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
