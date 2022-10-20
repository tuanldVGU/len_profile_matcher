import { useState, useEffect } from 'react'
import { client, recommendProfile } from '../api'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [profiles, setProfiles] = useState([])

  useEffect(()=>{
    fetchProfiles()
  },[])

  const fetchProfiles = async () => {
    try {
      const response = await client.query(recommendProfile).toPromise()
      console.log(response)
      console.log(response.data.recommendedProfiles)
      setProfiles(response.data.recommendedProfiles)
    } catch (err) {
      console.log(err)
    }


  }

  return (
    <div>
        {
          profiles.map((profile,i) => 
          (<Link href={`/profile/${profile.id}`} key={`profile-${i}`}>
              <a>
                <div className='profile'>
                  {
                    profile.picture && profile.picture.original ? (<Image src={profile.picture.original.url} className="image" width={75} height={75}></Image>) : <div className="image"></div>
                  }
                  <h2>{profile.handle}</h2>
                  <p>{profile.bio}</p>
                </div>
              </a>
            </Link>)
          )
        }
    </div>
  )
}
