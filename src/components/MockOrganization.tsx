import { ConnectButton } from "@/components/connect/ConnectButton"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import {
  connectorAtom,
  connectorDataAtom,
  walletStarknetkitNextAtom,
} from "@/state/connectedWalletStarknetkitNext"
import { useAtomValue, useSetAtom } from "jotai"
import { RESET } from "jotai/utils"
import { useEffect, useState } from "react"
import { DisconnectButton } from "@/components/DisconnectButton"
import { useAtom } from "jotai"
import { disconnect } from "starknetkit"
import { provider } from "@/constants"
import { AccountSection } from "@/components/AccountSection"
import { attensysOrgAddress } from "./../deployments/contracts"
import { attensysOrgAbi } from "./../deployments/abi"
import { Contract, } from "starknet"
import { sessionAccountAtom, sessionAtom, sessionKeyModeAtom } from "@/state/argentSessionState"
import { SessionKeys } from "./connect/SessionKeys"

const MockOrganization = () => {
  const setWalletLatest = useSetAtom(walletStarknetkitLatestAtom)
  const setWalletNext = useSetAtom(walletStarknetkitNextAtom)
  const setConnectorData = useSetAtom(connectorDataAtom)
  const setConnector = useSetAtom(connectorAtom)
  const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom)
  const sessionKeyMode = useAtomValue(sessionKeyModeAtom)
  const sessionAccount = useAtomValue(sessionAccountAtom)
  const session = useAtomValue(sessionAtom)
  const [inputValue, setInputValue] = useState("")
  const [orgInputValue, setOrgInputValue] = useState("")
  const [classOrgValue, setClassOrgValue] = useState("")
  const [instructorValue, setInstructorValue] = useState("")
  const [instructorInputValue, setInstructorInputValue] = useState("")
  const [orgData, setOrgData] = useState({
    address_of_org: "",
    nft_address: "",
    number_of_all_classes: 0,
    number_of_instructors: 0,
    number_of_students: 0,
    org_name: "",
  })
  const [isSuccess, setIsSuccess] = useState(false)

  //initialize provider with a Sepolia Testnet node
  const organizationContract = new Contract(
    attensysOrgAbi,
    attensysOrgAddress,
    provider,
  )

  // core write and read functions
  const registerOrg = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault()
      const myCall = organizationContract.populate("create_org_profile", [
        "web3",
        "http://w3bnft.com",
        "cairo",
        "CAO",
      ])

      if (sessionKeyMode) {
        if (!session || !sessionAccount) {
          throw new Error("No open session")
        }

        organizationContract.connect(sessionAccount)

        const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
          contractAddress: attensysOrgAddress,
          entrypoint: "create_org_profile",
          calldata: myCall.calldata,
        })

        const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10)

        const result = await organizationContract.create_org_profile(
          myCall.calldata,
          {
            maxFee,
          },
        )

        await provider.waitForTransaction(result.transaction_hash)
      } else {
        organizationContract.connect(wallet?.account)

        const result = await organizationContract.create_org_profile(myCall.calldata)
        await provider.waitForTransaction(result.transaction_hash)
      }
    } catch (error) {
      console.error("Error creating organization profile:", error);
    }
  }

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    organizationContract.connect(wallet?.account)
    const myCall = organizationContract.populate("get_org_info", [
      wallet?.account.address,
    ])
    const res = await organizationContract.get_org_info(myCall.calldata)
    if (res != undefined) {
      setIsSuccess(true)
      setOrgData(res)
    }
  }

  const handleAddInstructor = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    try {
      event.preventDefault()
      console.log(instructorValue)

      const myCall = organizationContract.populate("add_instructor_to_org", [
        instructorValue,
      ])

      if (sessionKeyMode) {
        if (!session || !sessionAccount) {
          throw new Error("No open session")
        }

        organizationContract.connect(sessionAccount)

        const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
          contractAddress: attensysOrgAddress,
          entrypoint: "add_instructor_to_org",
          calldata: myCall.calldata,
        })

        const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10)

        const result = await organizationContract.add_instructor_to_org(
          myCall.calldata,
          {
            maxFee,
          },
        )

        await provider.waitForTransaction(result.transaction_hash)
      } else {

        organizationContract.connect(wallet?.account)

        const res = await organizationContract.add_instructor_to_org(
          myCall.calldata,
        )

        await provider.waitForTransaction(res.transaction_hash)
      }

    } catch (error) {
      console.error("Error adding an instructor to organization:", error);
    }
  }

  const handleGetAllOrg = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    organizationContract.connect(wallet?.account)
    const myCall = organizationContract.populate("get_all_org_info", [])
    const res = await organizationContract.get_all_org_info(myCall.calldata)
    if (res != undefined) {
      //   console.log(res)
      //   setIsSuccess(true)
    }
  }
  const handleGetInstructor = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    organizationContract.connect(wallet?.account)
    const myCall = organizationContract.populate("get_org_instructors", [
      orgInputValue,
    ])
    const res = await organizationContract.get_org_instructors(myCall.calldata)
    if (res != undefined) {
      console.log(res)
    }
  }

  const handleCreateAClass = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    try {
      event.preventDefault()

      const myCall = organizationContract.populate("create_a_class", [
        classOrgValue,
      ])

      if (sessionKeyMode) {
        if (!session || !sessionAccount) {
          throw new Error("No open session")
        }

        organizationContract.connect(sessionAccount)

        const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
          contractAddress: attensysOrgAddress,
          entrypoint: "create_a_class",
          calldata: myCall.calldata,
        })

        const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10)

        const result = await organizationContract.create_a_class(
          myCall.calldata,
          {
            maxFee,
          },
        )

        await provider.waitForTransaction(result.transaction_hash)
      } else {

        organizationContract.connect(wallet?.account)

        const res = await organizationContract.create_a_class(
          myCall.calldata,
        )
        await provider.waitForTransaction(res.transaction_hash)
      }
    } catch (error) {
      console.error("Error creating a class:", error);
    }
  }

  const handleGetInstructorPartOfOrg = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    organizationContract.connect(wallet?.account)
    const myCall = organizationContract.populate("get_instructor_part_of_org", [instructorInputValue])
    const res = await organizationContract.get_instructor_part_of_org(myCall.calldata)
    if (res != undefined) {
      console.log(res)
      //   setIsSuccess(true)
    }
  }

  // handle input values

  const handleOnChange = (event: any) => {
    setInputValue(event.target.value)
  }
  const handleOnChange2 = (event: any) => {
    setInstructorValue(event.target.value)
  }
  const handleOnChange3 = (event: any) => {
    setOrgInputValue(event.target.value)
  }
  const handleOnChange4 = (event: any) => {
    setClassOrgValue(event.target.value)
  }
  const handleOnChange5 = (event: any) => {
    setInstructorInputValue(event.target.value)
  }

  console.log(orgData)

  useEffect(() => {
    setWalletLatest(RESET)
    setWalletNext(RESET)
    setConnectorData(RESET)
    setConnector(RESET)
  }, [inputValue])

  return (
    <div>
      {wallet ? (
        <>
          <DisconnectButton
            disconnectFn={disconnect}
            resetFn={() => {
              setWallet(RESET)
            }}
          />
          <SessionKeys />
        </>
      ) : (
        <ConnectButton />
      )}
      <AccountSection
        address={wallet?.account?.address}
        chainId={wallet?.chainId}
      />
      <h1 className="text-3xl font-bold text-red-700 underline">
        Organization test
      </h1>
      <br />

      <div className="px-4 border-4 py-3x m-7">
        <h1 className="my-5 font-bold">Register organization</h1>
        <div className="flex flex-row mb-4">
          <form>
            <div className="mb-4 ">
              <div className="flow flow-row">
                <label>
                  Organization Name:
                  <input
                    className="px-4 my-5 border-4 py-3x"
                    type="input"
                    // value={inputValue}
                    onChange={handleOnChange}
                  />
                </label>
                <label>
                  NFT Name:
                  <input
                    className="px-4 my-5 border-4 py-3x"
                    type="input"
                    // value={inputValue}
                    onChange={handleOnChange}
                  />
                </label>
                <label>
                  NFT Symbol:
                  <input
                    className="px-4 my-5 border-4 py-3x"
                    type="input"
                    // value={inputValue}
                    onChange={handleOnChange}
                  />
                </label>
                <label>
                  NFT URL:
                  <input
                    className="px-4 my-5 border-4 py-3x"
                    type="input"
                    // value={inputValue}
                    onChange={handleOnChange}
                  />
                </label>
              </div>

              <hr />
              <div className="block">
                <button
                  className={`${wallet?.selectedAddress ? "bg-blue-500 hover:bg-blue-700" : "bg-red-500"}  text-white font-bold py-2 px-4 rounded my-5`}
                  //@ts-ignore
                  onClick={registerOrg}
                  disabled={!wallet?.selectedAddress}
                >
                  Register
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="flex px-4 border-4 py-3x m-7">
        <div className="flex-1">
          <h1 className="my-5 font-bold">Read organization information</h1>
          <form onSubmit={handleOnSubmit}>
            <div className="flex flex-row mb-4">
              <input
                className="px-4 my-5 border-4 py-3x"
                type="input"
                value={inputValue}
                onChange={handleOnChange}
              />
              <button
                className="px-4 py-2 my-5 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                type="submit"
              >
                Get
              </button>
            </div>
          </form>

          {isSuccess ? (
            <div className="px-4 py-3x border-1">
              <p>Searched address: {inputValue}</p>
              <p>address_of_org: {orgData?.address_of_org}</p>
              <p>nft_address: {orgData?.nft_address}</p>
              <p>number_of_all_classes: {orgData?.number_of_all_classes}</p>
              <p>number_of_instructors: {orgData?.number_of_instructors}</p>
              <p>number_of_students: {orgData?.number_of_students}</p>
              <p>org_name: {orgData?.org_name}</p>
            </div>
          ) : (
            <p></p>
          )}
        </div>

        <div className="flex-auto mx-3">
          <h1 className="my-5 font-bold">Add instructor</h1>
          <form onSubmit={handleAddInstructor}>
            <div className="flex flex-row mb-4">
              <input
                className="px-4 my-5 border-4 py-3x"
                type="input"
                value={instructorValue}
                onChange={handleOnChange2}
              />
              <button
                className={`${wallet?.selectedAddress ? "bg-blue-500 hover:bg-blue-700" : "bg-red-500"}  text-white font-bold py-2 px-4 rounded my-5`}
                type="submit"
              >
                Add
              </button>
            </div>
          </form>
        </div>

        <div className="flex-auto mx-3">
          <h1 className="my-5 font-bold">Part of my organization</h1>
          <form onSubmit={handleGetInstructorPartOfOrg}>
            <div className="flex flex-row mb-4">
              <input
                className="px-4 my-5 border-4 py-3x"
                type="input"
                value={instructorInputValue}
                onChange={handleOnChange5}
              />
              <button
                className="px-4 py-2 my-5 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                type="submit"
              >
                Get
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex px-4 border-4 py-3x m-7">
        <div className="flex-1">
          <h1 className="my-5 font-bold">Get all organization</h1>
          <form onSubmit={handleGetAllOrg}>
            <div className="flex flex-row mb-4">
              <button
                className="px-4 py-2 my-5 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                type="submit"
              >
                Get
              </button>
            </div>
          </form>
        </div>

        <div className="flex-auto mx-3">
          <h1 className="my-5 font-bold">Get instructors in org:</h1>
          <form onSubmit={handleGetInstructor}>
            <div className="flex flex-row mb-4">
              <input
                className="px-4 my-5 border-4 py-3x"
                type="input"
                value={orgInputValue}
                onChange={handleOnChange3}
              />
              <button
                className="px-4 py-2 my-5 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                type="submit"
              >
                Get info
              </button>
            </div>
          </form>
        </div>

        <div className="flex-auto mx-3">
          <h1 className="my-5 font-bold">CREATE a class</h1>
          <form onSubmit={handleCreateAClass}>
            <div className="flex flex-row mb-4">
              <input
                className="px-4 my-5 border-4 py-3x"
                type="input"
                value={classOrgValue}
                onChange={handleOnChange4}
              />
              <button
                className={`${wallet?.selectedAddress ? "bg-blue-500 hover:bg-blue-700" : "bg-red-500"}  text-white font-bold py-2 px-4 rounded my-5`}
                type="submit"
              >
                Create a class
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MockOrganization
