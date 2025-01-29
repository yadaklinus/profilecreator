"use client"
import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card'
import { Avatar } from "@heroui/avatar";
import { useRef, useState } from "react";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { toPng } from "html-to-image";


export default function Home() {

  const [userName, setUserName] = useState('Yam Profile')
  const [handle, setHandle] = useState('yamprofile')
  const [text, setText] = useState('Frontend developer and UI/UX enthusiast. Join me on this coding adventure!')
  const [followers, setFollowers] = useState(2340000)
  const [following, setFollowing] = useState(7)
  const [imageUrl, setImageUrl] = useState('')
  const [hashtag, setHashtag] = useState('#Frontend')
  const [verrify, setVerrify] = useState(false)
  const eleRef = useRef("")

  function FollowersNumber() {
    if (followers > 1000000) {
      return `${(followers / 1000000).toFixed(1)}m`
    } else if (followers > 1000) {
      return `${(followers / 1000).toFixed(1)}k`
    } else {
      return followers
    }
  }
  function FollowingNumber() {
    if (following > 1000000) {
      return `${(following / 1000000).toFixed(1)}m`
    } else if (following > 1000) {
      return `${(following / 1000).toFixed(1)}k`
    } else {
      return following
    }
  }

  function handleProfileChange(ev) {
    const files = ev.target.files
    if (files?.length > 0) {
      setImageUrl(URL.createObjectURL(ev.target.files[0]))
    }
  }

  function Badge() {
    return (
      <img width={'15px'} src="/check.svg" />
    )
  }

  function createImage() {
    toPng(eleRef.current, { cacheBust: false })
      .then(dataUrl => {
        const link = document.createElement('a')
        link.download = `profile-image-${userName}.png`
        link.href = dataUrl
        link.click()
        console.log("clicked")
      })
  }


  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Card ref={eleRef} className="p-9">
        <Card className="max-w-[340px]">
          <CardHeader className="justify-between">
            <div className="flex gap-5">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src={imageUrl}
              />
              <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small flex font-semibold leading-none text-default-600">{userName}&nbsp;{verrify ? <Badge /> : ""}</h4>
                <h5 className="text-small tracking-tight text-default-400">@{handle.trim().toLowerCase()}</h5>
              </div>
            </div>
          </CardHeader>
          <CardBody className="px-3 py-0 text-small text-default-400">
            <p>{text}</p>
            <span className="pt-2">
              {hashtag}
            </span>
          </CardBody>
          <CardFooter className="gap-3">
            <div className="flex gap-1">
              <p className="font-semibold text-default-400 text-small"><FollowingNumber /></p>
              <p className=" text-default-400 text-small">Following</p>
            </div>
            <div className="flex gap-1">
              <p className="font-semibold text-default-400 text-small"><FollowersNumber /></p>
              <p className="text-default-400 text-small">Followers</p>
            </div>
          </CardFooter>
        </Card>
      </Card>


      <div>

        <Card className="max-w-[340px] p-4">
          <div className="text-center text-xl font-bold">Profile Information</div>

          <Button onPress={(() => setVerrify(!verrify))} type="submit" className={`${buttonStyles({
            color: verrify ? "primary" : "default"
          })} mb-4`}>{verrify ? "Verrifed" : "Verrify"}</Button>

          <Input label="Image" accept="image/*" className="mb-4" type="file" onChange={handleProfileChange} />
          <Input className="mb-4" onChange={(ev) => { setUserName(ev.target.value) }} label="User Name" />
          <Input className="mb-4" onChange={(ev) => { setHandle(ev.target.value) }} label="Handle" />
          <Input label="Hasttags" onChange={(ev => { setHashtag(ev.target.value) })} className="mb-4" />
          <Input label="Following" type="number" onChange={(ev) => { setFollowing(Number(ev.target.value)) }} className="mb-4" />
          <Input label="Followers" type="number" onChange={(ev) => { setFollowers(Number(ev.target.value)) }} className="mb-4" />
          <Textarea className="mb-4" onChange={(ev) => { setText(ev.target.value) }} label="Text" />
          <Button onPress={createImage} className={buttonStyles({
            color: "primary"
          })}>Generate Image</Button>
        </Card>
      </div>




    </section >
  );
}
