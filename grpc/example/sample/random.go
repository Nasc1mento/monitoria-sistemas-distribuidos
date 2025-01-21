package sample

import (
	"math/rand"
	"monitoria/grpc/example/pb"

	"github.com/google/uuid"
)

func randomKeyboardLayout() pb.Keyboard_Layout {
	switch rand.Intn(5) {
	case 1:
		return pb.Keyboard_QWERTY
	case 2:
		return pb.Keyboard_DVORAK
	case 3:
		return pb.Keyboard_COLEMAK
	case 4:
		return pb.Keyboard_QWERTZ
	default:
		return pb.Keyboard_AZERTY
	}
}

func randomBool() bool {
	return rand.Intn(2) == 1
}

func randomInt(min, max int) int {
	return min + rand.Intn(max-min+1)
}

func randomCPUBrand() string {
	return randomStringFromSet([]string{"Intel", "AMD"})
}

func randomStringFromSet(set []string) string {
	return set[rand.Intn(len(set))]
}

func randomCPUName(brand string) string {
	if brand == "Intel" {
		return randomStringFromSet([]string{"Core i7", "Core i5", "Core i3"})
	}

	return randomStringFromSet([]string{"Ryzen 7", "Ryzen 5", "Ryzen 3"})
}

func randomGPUBrand() string {
	return randomStringFromSet([]string{"Nvidia", "AMD"})
}

func randomGPUName(brand string) string {
	if brand == "Nvidia" {
		return randomStringFromSet([]string{"GTX 3050", "GTX 3060", "GTX 4090"})
	}

	return randomStringFromSet([]string{"RX 6600", "RX 7600", "RX 6750XT"})
}

func randomLaptopBrand() string {
	return randomStringFromSet([]string{"Lenovo", "Dell", "Apple"})
}

func randomLaptopName(brand string) string {
	if brand == "Lenovo" {
		return randomStringFromSet([]string{"ThinkPad", "IdeaPad"})
	}

	if brand == "Dell" {
		return randomStringFromSet([]string{"Inspiron", "Latitude"})
	}

	return randomStringFromSet([]string{"MacBook Pro", "MacBook Air"})
}

func randomScreenPanel() pb.Screen_Panel {
	if rand.Intn(2) == 1 {
		return pb.Screen_OLED
	}

	return pb.Screen_IPS
}

func randomScreenResolution() *pb.Screen_Resolution {
	return &pb.Screen_Resolution{
		Width:  uint32(randomInt(1280, 3840)),
		Height: uint32(randomInt(720, 2160)),
	}
}

func randomFloat64(min, max float64) float64 {
	return min + rand.Float64()*(max-min)
}

func randomFloat32(min, max float32) float32 {
	return min + rand.Float32()*(max-min)
}

func randomID() string {
	return uuid.New().String()
}
