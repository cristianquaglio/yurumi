import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard, Roles, UserRoles } from '@app/common';
import { DependencesService } from './dependences.service';
import { CreateDependenceDto, UpdateDependenceDto } from './dto';

@Controller('dependences')
@ApiTags('Dependences')
export class DependencesController {
  constructor(private readonly dependencesService: DependencesService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.SA)
  @Post()
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create a new dependence' })
  @ApiResponse({
    status: 201,
    description: 'Created',
    example: {
      _id: '66e270661f8266f042a0c946',
      type: 'PRIVATE',
      shortName: 'CEMEBAs',
      fullName: 'Centro Médico Buenos Aires S.As.',
      tributaryType: 'CUIT',
      tributaryId: '30710404131',
      status: 'ACTIVE',
      createdAt: '2024-09-12T04:39:02.297Z',
      updatedAt: '2024-09-12T04:39:02.297Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: {
      statusCode: 400,
      message: [
        'type must be one of the following values: PUBLIC, PRIVATE, MIXT',
        'shortName should not be empty',
        'shortName must be a string',
        'fullName should not be empty',
        'fullName must be a string',
        'tributaryType must be one of the following values: CUIT',
        'tributaryId should not be empty',
        'tributaryId must be a string',
      ],
      error: 'Bad Request',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Bad Request',
    example: {
      statusCode: 401,
      message: 'Duplicated data in database',
    },
  })
  create(@Body() createDependenceDto: CreateDependenceDto) {
    return this.dependencesService.create(createDependenceDto);
  }

  @Get()
  @ApiCookieAuth()
  @ApiOperation({ summary: 'List all dependences' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    example: [
      {
        _id: '66e1f07fa148fc3fe843a5d3',
        type: 'PRIVATE',
        shortName: 'CEMEBA',
        fullName: 'Centro Médico Buenos Aires',
        tributaryType: 'CUIT',
        tributaryId: '30271891300',
        status: 'INACTIVE',
        createdAt: '2024-09-11T19:33:19.913Z',
        updatedAt: '2024-09-12T02:56:38.573Z',
      },
      {
        _id: '66e1f0b0a148fc3fe843a5db',
        type: 'PUBLIC',
        shortName: 'Hospital Favaloro',
        fullName: 'Hospital Nivel III Dr Rene Favaloro',
        tributaryType: 'CUIT',
        tributaryId: '20271891300',
        status: 'ACTIVE',
        createdAt: '2024-09-11T19:34:08.807Z',
        updatedAt: '2024-09-11T19:34:08.807Z',
      },
    ],
  })
  findAll() {
    return this.dependencesService.findAll();
  }

  @Get(':id')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get dependence by ID' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    example: {
      _id: '66e1f07fa148fc3fe843a5d3',
      type: 'PRIVATE',
      shortName: 'CEMEBA',
      fullName: 'Centro Médico Buenos Aires',
      tributaryType: 'CUIT',
      tributaryId: '30271891300',
      status: 'INACTIVE',
      createdAt: '2024-09-11T19:33:19.913Z',
      updatedAt: '2024-09-12T02:56:38.573Z',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Bad Request',
    example: {
      statusCode: 404,
      message: 'Related field does not exist',
      error: 'Not Found',
    },
  })
  findOne(@Param('id') id: string) {
    return this.dependencesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.SA)
  @Patch(':id')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update dependence' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    example: {
      _id: '66e1f07fa148fc3fe843a5d3',
      type: 'PRIVATE',
      shortName: 'CEMEBA',
      fullName: 'Centro Médico Buenos Aires',
      tributaryType: 'CUIT',
      tributaryId: '30271891300',
      status: 'INACTIVE',
      createdAt: '2024-09-11T19:33:19.913Z',
      updatedAt: '2024-09-12T02:56:38.573Z',
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    example: {
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Bad Request',
    example: {
      statusCode: 404,
      message: 'Document was not found',
      error: 'Not Found',
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateDependenceDto: UpdateDependenceDto,
  ) {
    return this.dependencesService.update(id, updateDependenceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.SA)
  @Delete(':id')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete dependence' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    example: { statusCode: 200, message: 'Document deleted' },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    example: {
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Bad Request',
    example: {
      statusCode: 404,
      message: 'Document was not found',
      error: 'Not Found',
    },
  })
  async remove(@Param('id') id: string) {
    const dependence = await this.dependencesService.remove(id);
    if (dependence) {
      return { statusCode: 200, message: 'Document deleted' };
    }
  }
}
