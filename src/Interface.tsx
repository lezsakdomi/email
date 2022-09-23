import * as React from 'react'
import {MdSend} from 'react-icons/all'
import {useRef, useState} from 'react'
import {Editor} from '@tinymce/tinymce-react'

export default function Interface({enabled}: {enabled: boolean}): JSX.Element {
    const labelMinWidth = '4em'
    const [isSending, setIsSending] = useState<boolean>(false)
    const formRef = useRef<HTMLFormElement>()
    const fromRef = useRef<HTMLSelectElement>()
    const bccRef = useRef<HTMLInputElement>()

    return (
        <form
            ref={formRef}
            style={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid black',
                borderRadius: '5px',
                padding: '1em',
                marginTop: '1em',
                flexGrow: 1,
                color: enabled ? 'black' : 'grey',
            }}
            onSubmit={event => {
                event.preventDefault()
                // @ts-ignore
                tinymce.triggerSave()
                const data = [...formRef.current.elements as unknown as HTMLInputElement[]]
                    .filter(e => e.name)
                    .reduce((a, v) => Object.assign(a, {[v.name]: v.value}), {})
                console.log(data)
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
            <Editor
                tinymceScriptSrc="tinymce/tinymce.min.js"
                textareaName="html"
                disabled={!enabled || isSending}
                init={{
                    plugins: [
                        "image",
                        "table",
                        "link",
                        "autolink",
                        "save",
                        "autosave",
                    ],
                    file_picker_callback: function(callback, value, meta) {
                        const input = document.createElement('input')
                        input.type = 'file'
                        if (meta.filetype === 'image') {
                            input.accept = "image/*"
                        }
                        input.addEventListener('input', () => {
                            const reader = new FileReader()
                            reader.readAsDataURL(input.files[0])
                            reader.addEventListener('load', () => {
                                const url = reader.result as string;
                                callback(url)
                            })
                        })
                        input.click()
                    },
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
