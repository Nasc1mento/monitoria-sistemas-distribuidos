package serializer

import (
	"google.golang.org/protobuf/encoding/protojson"
	"google.golang.org/protobuf/proto"
)

func ProtobufToJson(message proto.Message) ([]byte, error) {
	marshaller := protojson.MarshalOptions{
		Indent:         " ",
		UseProtoNames:  true,
		UseEnumNumbers: false,
	}

	return marshaller.Marshal(message)
}
