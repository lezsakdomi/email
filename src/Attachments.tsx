import * as React from 'react'
import {MdAttachFile, MdDelete} from 'react-icons/md'

export interface IAttachment {
    content: string;
    type: string;
    filename: string;
    disposition?: 'inline' | 'attachment';
    content_id?: string;
    _contentUrl: string;
    _fileSize: string;
}

export function Attachments({enabled, attachments, setAttachments}: {
    enabled: boolean;
    attachments: IAttachment[];
    setAttachments: (value: (((prevState: IAttachment[]) => IAttachment[]) | IAttachment[])) => void;
}) {
    return (<div style={{
        display: 'flex',
        flexDirection: 'column',
    }}>
        {attachments.map((attachment, i) => <div key={i} className="attachment" style={{
            display: 'flex',
            marginTop: '0.5em',
            marginBottom: '0.5em',
        }}>
            <div style={{
                marginRight: '0.5em',
                flexShrink: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
            }}>
                <MdAttachFile/>
                <span> </span>
                <a href={attachment._contentUrl} download>{attachment.filename}</a>
            </div>
            <div style={{
                color: 'gray',
                marginRight: '2em',
                whiteSpace: 'nowrap',
            }}>{attachment._fileSize}</div>
            {enabled ? <button onClick={event => {
                event.preventDefault()
                attachments = [...attachments]
                attachments.splice(i, 1)
                setAttachments(attachments)
            }} style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
            }}><MdDelete/></button> : undefined}
        </div>)}
        {enabled ? <button onClick={event => {
            event.preventDefault()

            const input = document.createElement('input')
            input.type = 'file'
            input.addEventListener('input', async () => {
                const file = input.files[0]
                const filename = file.name
                const type = file.type
                const _fileSize = Math.round(file.size / 1000) / 1000 + " MB"
                const [_contentUrl, content] = await Promise.all([new Promise<string>(resolve => {
                    const reader = new FileReader()
                    reader.readAsDataURL(file)
                    reader.addEventListener('load', () => {
                        const url = reader.result as string
                        resolve(url)
                    })
                }), new Promise<string>(resolve => {
                    const reader = new FileReader()
                    reader.readAsBinaryString(file)
                    reader.addEventListener('load', () => {
                        resolve(btoa(reader.result as string))
                    })
                })])

                setAttachments(attachments => [...attachments, {
                    content,
                    type,
                    filename,
                    _contentUrl,
                    _fileSize,
                }])
            })
            input.click()
        }} style={{
            marginTop: '0.5em',
            marginRight: 'auto',
        }}>
            Add attachment
        </button> : undefined}
    </div>)
}
