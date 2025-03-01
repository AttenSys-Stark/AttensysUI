import React from "react";

const LeftSideBar = () => {
  const properties = [
    {
      id: 1,
      title: "Course Setup (Basic info)",
      periphery: [
        "Course Name",
        "Course description",
        "Course category",
        "Course Level",
      ],
    },
    {
      id: 2,
      title: "Learning outcomes",
      periphery: [
        "Student requirements",
        "Learning Objectives",
        "Target Audience",
      ],
    },
    {
      id: 3,
      title: "Course & curriculum",
      periphery: ["Course creative", "Course Curriculum"],
    },
    {
      id: 4,
      title: "Pricing & Discounts",
      periphery: ["Course Pricing", "Promos and discounts"],
    },
    {
      id: 5,
      title: "Review & Publish",
      periphery: ["Publish Course"],
    },
  ];
  return (
    <div>
      {properties.map((item, id) => (
        <div key={id} className="my-7">
          <div className="border-l-4 border-[#4A90E2] my-3 text-[#4A90E2] h-6 ">
            <h4 className="ml-5">{item.title}</h4>
          </div>
          <div>
            {item.periphery.map((prop, i) => (
              <div className="flex ml-10" key={i}>
                <input
                  type="checkbox"
                  className="text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-3"
                />
                <p className="text-sm py-2">{prop}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeftSideBar;
