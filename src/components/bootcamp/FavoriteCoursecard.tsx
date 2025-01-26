import React from "react"
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  CardProps,
} from "@material-tailwind/react"

import robotImg from "../../assets/roboy.png"
import Image from "next/image"
import { IoIosStar } from "@react-icons/all-files/io/IoIosStar"
import StarRating from "./StarRating"

interface favoritecourseprop {
  title: string
  name: string
  numberofstudent: number
  instructor: string
  flier: any
  stars: number
}

const FavoriteCourseCard: React.FC<favoritecourseprop> = (props) => {
  return (
    <Card
      className="w-full rounded-xl max-w-[400px] mx-auto md:w-[95%]"
      placeholder={undefined}
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    >
      <CardBody
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        className="m-0 p-0"
      >
        <Image
          className="object-cover w-full h-auto max-h-[120px] rounded-t-xl"
          alt="robot"
          src={props.flier}
        />
        <div className="flex justify-between items-start p-2.5">
          {/* course prop  */}
          <div>
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-2 text-sm font-bold"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {props.title}
            </Typography>
            <Typography
              className="text-white items-center text-[10px] bg-[#5801A9] font-extrabold rounded p-1"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {props.name}
            </Typography>
          </div>

          <div>
            {/* go to course */}
            <Button
              size="md"
              variant="text"
              className="items-center gap-2 bg-blue-400 text-white text-xs font-semibold"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Go to course
            </Button>
          </div>
        </div>
      </CardBody>
      <CardFooter
        className="pt-0 rounded-b-xl"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="flex items-center w-full justify-between space-x-4">
          {/* rating */}
          <StarRating totalStars={5} starnumber={props.stars} />
          <p className="ml-8 text-[14px] font-medium text-[#2D3A4B]">
            <span className="text-[#A01B9B]"> {props.numberofstudent}</span>{" "}
            students
          </p>
        </div>
        <div>
          <Typography
            variant="h4"
            color="blue-gray"
            className="text-sm py-2 text-left font-normal"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Created by <span className="underline">{props.instructor}</span>
          </Typography>
        </div>
      </CardFooter>
    </Card>
  )
}

export default FavoriteCourseCard
