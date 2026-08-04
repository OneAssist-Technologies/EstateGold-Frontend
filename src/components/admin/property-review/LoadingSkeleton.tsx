"use client";

export default function LoadingSkeleton() {

  return (

    <div
      className="
        max-w-7xl
        mx-auto
        p-8
        animate-pulse
        space-y-8
      "
    >

      <div
        className="
          h-20
          rounded-3xl
          bg-gray-200
        "
      />

      <div
        className="
          grid
          grid-cols-12
          gap-8
        "
      >

        <div
          className="
            col-span-7
            h-[500px]
            rounded-3xl
            bg-gray-200
          "
        />

        <div
          className="
            col-span-5
            h-[500px]
            rounded-3xl
            bg-gray-200
          "
        />

      </div>

      {[1,2,3,4].map((item)=>(

        <div
          key={item}
          className="
            h-72
            rounded-3xl
            bg-gray-200
          "
        />

      ))}

    </div>

  );

}