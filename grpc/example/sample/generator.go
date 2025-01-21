package sample

import (
	"monitoria/grpc/example/pb"

	"google.golang.org/protobuf/types/known/timestamppb"
)

func NewKeyBoard() *pb.Keyboard {
	keyboard := &pb.Keyboard{
		Layout:  randomKeyboardLayout(),
		Backlit: randomBool(),
	}

	return keyboard
}

func NewCpu() *pb.CPU {

	brand := randomCPUBrand()
	name := randomCPUName(brand)

	numberCores := randomInt(2, 8)
	numberThreads := randomInt(numberCores, 12)

	minFrequency := randomFloat64(2.0, 3.5)
	maxFrequency := randomFloat64(minFrequency, 5.0)

	cpu := &pb.CPU{
		Brand:         brand,
		Name:          name,
		NumberCores:   uint32(numberCores),
		NumberThreads: uint32(numberThreads),
		MinFrequency:  minFrequency,
		MaxFrequency:  maxFrequency,
	}

	return cpu
}

func NewGpu() *pb.GPU {
	brand := randomGPUBrand()
	name := randomGPUName(brand)

	minFrequency := randomFloat64(1.0, 1.5)
	maxFrequency := randomFloat64(minFrequency, 2.0)

	memory := &pb.Memory{
		Value: uint64(randomInt(4, 16)),
		Uint:  pb.Memory_GIGABYTE,
	}

	gpu := &pb.GPU{
		Brand:        brand,
		Name:         name,
		MinFrequency: minFrequency,
		MaxFrequency: maxFrequency,
		Memory:       memory,
	}

	return gpu
}

func NewMemory() *pb.Memory {
	memory := &pb.Memory{
		Value: uint64(randomInt(4, 32)),
		Uint:  pb.Memory_GIGABYTE,
	}

	return memory
}

func NewStorage() *pb.Storage {
	storage := &pb.Storage{
		Driver: pb.Storage_SSD,
		Memory: &pb.Memory{
			Value: uint64(randomInt(128, 1024)),
			Uint:  pb.Memory_GIGABYTE,
		},
	}

	return storage
}

func NewScreen() *pb.Screen {
	screen := &pb.Screen{
		SizeInches: randomFloat32(13, 17),
		Panel:      pb.Screen_IPS,
		Resolution: randomScreenResolution(),
		Touch:      randomBool(),
	}

	return screen
}

func NewLaptop() *pb.Laptop {
	brand := randomLaptopBrand()
	name := randomLaptopName(brand)

	laptop := &pb.Laptop{
		Id:    randomID(),
		Brand: brand,
		Name:  name,
		Cpu:   NewCpu(),
		Gpu: []*pb.GPU{
			NewGpu(),
		},
		Memory: NewMemory(),
		Storage: []*pb.Storage{
			NewStorage(),
		},

		Screen:      NewScreen(),
		Keyboard:    NewKeyBoard(),
		Weight:      &pb.Laptop_WeightKg{WeightKg: randomFloat64(1.0, 3.0)},
		PriceUsd:    randomFloat64(1500, 3000),
		ReleaseYear: uint32(randomInt(2015, 2021)),
		UpdatedAt:   timestamppb.Now(),
	}

	return laptop
}
