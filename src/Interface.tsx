import * as React from 'react'
import {MdSend} from 'react-icons/all'
import {useRef, useState} from 'react'

export default function Interface({enabled}: {enabled: boolean}): JSX.Element {
    const labelMinWidth = '4em'
    const [isSending, setIsSending] = useState<boolean>(false)
    const fromRef = useRef<HTMLSelectElement>()
    const bccRef = useRef<HTMLInputElement>()

    return (
        <form
            style={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid black',
                borderRadius: '5px',
                padding: '1em',
                marginTop: '1em',
                flexGrow: 1,
            }}
            onSubmit={event => {
                event.preventDefault()
                console.log(event)
                setIsSending(true)
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: '0.5em',
                }}
            >
                <label style={{
                    marginRight: '0.5em',
                    display: 'inline-block',
                    minWidth: labelMinWidth,
                }}>From:</label>
                <select
                    ref={fromRef}
                    name="from"
                    onChange={event => {
                        if (event.target.value === "") {
                            event.preventDefault();
                            const email = prompt("Please provide the new email address");
                            if (email) {
                                alert("Adding new email address to database")
                            } else {
                                // @ts-ignore
                                event.target.value = event.target.lastValue || event.target.children[0].value;
                            }
                        } else {
                            // @ts-ignore
                            event.target.lastValue = event.target.value;
                        }
                    }}
                    disabled={!enabled || isSending}
                >
                    <option>email1</option>
                    <option>email2</option>
                    <option
                        value=""
                        style={{
                            fontStyle: 'italic',
                        }}
                    >
                        + Add email address
                    </option>
                </select>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: '0.5em',
                }}
            >
                <label style={{
                    marginRight: '0.5em',
                    display: 'inline-block',
                    minWidth: labelMinWidth,
                }}>To:</label>
                <input
                    name="to"
                    disabled={!enabled || isSending}
                    style={{
                        flexGrow: 1,
                    }}
                    placeholder='John Doe <john.doe@example.com>, test@example.com'
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: '0.5em',
                }}
            >
                <label style={{
                    marginRight: '0.5em',
                    display: 'inline-block',
                    minWidth: labelMinWidth,
                }}>CC:</label>
                <input
                    name="cc"
                    disabled={!enabled || isSending}
                    style={{
                        flexGrow: 1,
                    }}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: '0.5em',
                }}
            >
                <label style={{
                    marginRight: '0.5em',
                    display: 'inline-block',
                    minWidth: labelMinWidth,
                }}>BCC:</label>
                <input
                    ref={bccRef}
                    name="bcc"
                    disabled={!enabled || isSending}
                    style={{
                        flexGrow: 1,
                    }}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: '1em',
                }}
            >
                <label style={{
                    marginRight: '0.5em',
                    display: 'inline-block',
                    minWidth: labelMinWidth,
                }}>Subject:</label>
                <input
                    name="subject"
                    disabled={!enabled || isSending}
                    style={{
                        flexGrow: 1,
                    }}
                />
            </div>
            <textarea
                name="text"
                disabled={!enabled || isSending}
                style={{
                    flexGrow: 1,
                    resize: 'none',
                    minHeight: '200px',
                }}
            />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: '1em',
                }}
            >
                <div>
                    <input
                        id='sendCopyToMyselfCheckbox'
                        onInput={(event) => {
                            // @ts-ignore
                            if (event.target.checked) {
                                bccRef.current.value =
                                    [
                                        ...bccRef.current.value.split(/,\s*/g),
                                        fromRef.current.value,
                                    ].filter(s => s).join(", ")
                            } else {
                                bccRef.current.value =
                                    bccRef.current.value.split(/,\s*/g)
                                        .filter(s => s !== fromRef.current.value)
                                        .filter(s => s)
                                        .join(", ")
                            }
                        }}
                        disabled={!enabled || isSending}
                        type={'checkbox'}
                    />
                    <label htmlFor='sendCopyToMyselfCheckbox'>Also send a copy to my email address</label>
                </div>
                <button
                    style={{
                        marginLeft: 'auto',
                        fontStyle: isSending && 'italic',
                    }}
                    disabled={!enabled || isSending}
                >
                    <MdSend/> Send
                </button>
            </div>
        </form>
    )
}
