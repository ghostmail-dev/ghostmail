package mongodb

import (
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// StructuredHeader represents a structured object for headers with arguments.
type StructuredHeader struct {
	Value  string            `bson:"value"`
	Params map[string]string `bson:"params"`
}

// EmailAddress represents address details.
type EmailAddress struct {
	Address *string        `bson:"address,omitempty"`
	Name    string         `bson:"name"`
	Group   []EmailAddress `bson:"group,omitempty"`
}

// AddressObject represents an address object.
type AddressObject struct {
	Value []EmailAddress `bson:"value"`
	HTML  string         `bson:"html"`
	Text  string         `bson:"text"`
}

// Headers represents a map object with lowercase header keys.
type Headers map[string]interface{}

// HeaderLine represents a single header line.
type HeaderLine struct {
	Key  string `bson:"key"`
	Line string `bson:"line"`
}

// HeaderLines represents an array of raw header lines.
type HeaderLines []HeaderLine

// AttachmentCommon represents the common part of the Attachment object.
type AttachmentCommon struct {
	Type               string      `bson:"type"`
	Content            interface{} `bson:"content"`
	ContentType        string      `bson:"contentType"`
	ContentDisposition string      `bson:"contentDisposition"`
	Filename           *string     `bson:"filename,omitempty"`
	Headers            Headers     `bson:"headers"`
	HeaderLines        HeaderLines `bson:"headerLines"`
	Checksum           string      `bson:"checksum"`
	Size               int         `bson:"size"`
	ContentID          *string     `bson:"contentId,omitempty"`
	CID                *string     `bson:"cid,omitempty"`
	Related            *bool       `bson:"related,omitempty"`
}

// Attachment represents the attachment object.
type Attachment struct {
	AttachmentCommon
	Content []byte `bson:"content"`
	Related bool   `bson:"related"`
}

// Email represents a parsed mail object.
type Email struct {
	Attachments []Attachment   `bson:"attachments"`
	Headers     Headers        `bson:"headers"`
	HeaderLines HeaderLines    `bson:"headerLines"`
	HTML        interface{}    `bson:"html"` // string or bool
	Text        *string        `bson:"text,omitempty"`
	TextAsHTML  *string        `bson:"textAsHtml,omitempty"`
	Subject     *string        `bson:"subject,omitempty"`
	References  interface{}    `bson:"references,omitempty"` // string or []string
	Date        *time.Time     `bson:"date,omitempty"`
	To          interface{}    `bson:"to,omitempty"` // AddressObject or []AddressObject
	From        *AddressObject `bson:"from,omitempty"`
	CC          interface{}    `bson:"cc,omitempty"`  // AddressObject or []AddressObject
	BCC         interface{}    `bson:"bcc,omitempty"` // AddressObject or []AddressObject
	ReplyTo     *AddressObject `bson:"replyTo,omitempty"`
	MessageID   *string        `bson:"messageId,omitempty"`
	InReplyTo   *string        `bson:"inReplyTo,omitempty"`
	Priority    *string        `bson:"priority,omitempty"` // "normal" | "low" | "high"
}

func (db *DB) GetEmailById(id string) (*Email, error) {
	emailCollection := db.Client.Database("ghostmail").Collection("emails")
	var objId, _ = primitive.ObjectIDFromHex(id)
	var result Email
	err := emailCollection.FindOne(db.Ctx, bson.M{"_id": objId}).Decode(&result)
	if err != nil {
		return nil, err
	}

	return &result, nil
}
