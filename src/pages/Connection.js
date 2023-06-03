import React, { useState, useEffect } from "react"
import { connect } from "simple-web-serial"

function Connection({ lastPage, movePage }) {
  const [port, setPort] = useState(null)

  useEffect(() => {
    // Connect to serial port
    connect(9600)
      .then((port) => {
        setPort(port)
        movePage(lastPage) // Move to last page after connection is established
      })
      .catch((error) => {
        console.log(error)
      })
  
    // Disconnect from serial port on unmount
    return () => {
      if (port) {
        port.disconnect()
      }
    }
  }, [])

  // function handleDisconnect() {
  //   // Disconnect from serial port
  //   if (port) {
  //     port.disconnect();
  //   }
  //   setPort(null);
  //   movePage("connection");
  // }

  return (
    <div>
      {port ? (
        <div>
          <h2>Serial connected</h2>
        </div>
      ) : (
        <div>
          <h2>Serial not connected</h2>
          <p>Please connect to the serial port and try again.</p>
        </div>
      )}
    </div>
  )
}

export default Connection
