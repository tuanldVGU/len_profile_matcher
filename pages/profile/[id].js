import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { client, getProfileById, getPubsFromId } from '../../api'
import Image from 'next/image'
import Link from 'next/link'
import {ethers} from 'ethers'

import abi from '../../api.json'
const address = '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'


export default function Profile() {

  const router = useRouter()
  const { id } = router.query
  const [profile, setProfile] = useState()

  const [pubs, setPubs] = useState([])

  useEffect(()=>{
    if (id) {
      fetchProfile()
    }
  },[id])

  const fetchProfile = async () => {
    try {
      const response = await client.query(getProfileById,{id}).toPromise()
      setProfile(response.data.profile)
      const pubsData = await fetchPubs(response.data.profile.id)
      setPubs(pubsData)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchPubs = async (pid) => {
    try {
      const response = await client.query(getPubsFromId,{id: pid}).toPromise()
      console.log(response)
      // console.log(response.data.recommendedProfiles)
      return response.data.publications.items
    } catch (err) {
      console.log(err)
      return []
    }
  }

  const connect =  async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    })
    console.log({accounts})
  }

  const followUser = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(
      address,
      abi,
      signer
    )

    try {
      const tx = contract.follow(
        [id], [0x0]
      )

      await tx.wait()
      console.log("Follow success")
    }
    catch (err) {

    }
  }

  return (
    !profile ? <p>Loading ...</p> :
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Link href={'/'}> Back home</Link>
      <button onClick={() => {connect()}}>Connect</button>
      
      {
        profile && profile.picture && profile.picture.original ? (<Image src={profile.picture.original.url} className="image" width={75} height={75}></Image>) : <div style={{width: 75, height: 75, background: 'red', borderRadius: '50%'}}></div>
        
      }
      <h2>{profile.handle}</h2>
      <p>{profile.bio}</p>
      <p>Total followers: {profile.stats.totalFollowers}</p>
      <p>Total following: {profile.stats.totalFollowing}</p>
      <button onClick={() => {followUser()}}> Follow this user</button>
      {
        pubs.map((pub,i) => (
          <div style={{padding: 20, border: "1px solid #fff", width: '90%', margin: 10 }} key={`pub-${i}`}>
            {pub.metadata.content}
          </div>
        ))
      }
    </div>
  )

}